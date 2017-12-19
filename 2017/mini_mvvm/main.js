;(function(window) {

  // Dependence, to notify watchers of data
  class Dep {
    constructor() {
      this.watchers = []
    }

    add(watcher) {
      this.watchers.push(watcher)
    }

    notify(val) {
      this.watcher.forEach(function(watcher) {
        watcher.update(val)
      })
    }
  }

  // Watchers, which entity is the reference of data in DOM
  class Watcher {
    constructor(parn, key, cb) {
      this.parn = parn
      this.key = key
      this.cb = cb
      this.init()
    }

    update(val) {
      this.run(val)
    }

    run(newVal) {
      var oldVal = this.value
      this.value = newVal
      this.cb.call(this, newVal, oldVal)
    }

    init() {
      Watcher.watcher = this
      this.value = this.parn[this.key]
      Watcher.watcher = undefined
    }
  }

  // Evaluation environment
  class Env {
    constructor(env, parn) {
      this.env = env
      this.parn = parn || null
    }
    add(key, value) {
      this.env[key] = value
    }
    find(key) {
      return this.env[key] || (this.parn ? this.parn.find(key) : null)
    }
  }

  // Built-in directive
  class Directive {
    constructor(parser) {
      this.parser = parser
      this.dirs = {
        for: {
          p: function(env, exp) {
          },
          e: function(env, exp) {
          },
          n: true
        },
        if: {
          p: function(node, env, exp) {
            // evaluate expression
          },
          e: function(node, r) {
            // operate dom with evaluate result
          },
          n: false
        }
        show: {
          p: function(env, exp) {
          },
          e: function(env, exp) {
          },
          n: false
        }
      }
    }

    check(node, parnEnv) {
      var childEnv = null
      Object.keys(this.dirs).forEach(dir => {
        var exp = node.getAttribute(dir)
        if (exp) {
          if (this.dirs[dir].n) {
            if (! childEnv) {
              childEnv = new Env({}, parnEnv)
            }
            this.dirs[dir].p(childEnv, exp)
          } else {
            this.dirs[dir].p(parnEnv, exp)
          }
        }
      })
    }
  }

  // Parser, analyze the reference of data in DOM and bind to the specific Watcher
  class Parser {
    constructor(el, env) {
      this.el = el
      this.env = env
      this.dirs = new Directive(this)
      this.reg = /\{\{(.*)\}\}/
    }

    nodeToFragment() {
      var f = document.createDocumentFragment()
      var child = this.el.firstChild
      while (child) {
        f.appendChild(child)
        child = this.el.firstChild
      }
      return f
    }

    parseNodeTree(f, env) {
      var childNodes = f.childNodes
      Array.prototype.slice.call(childNodes).forEach(node => {
        var text = node.textContent
        if (node.nodeType === 3 && this.reg.test(text)) {
          this.parseText(node, env)
        } else if (node.nodeType === 1) {
          this.parseNode(node, env)
        }
        //if (node.childNodes && node.childNodes.length) {
          //this.parseNodeTree(node, env)
        //}
      })
    }

    parseNode(node, env) {
      this.dirs.check(node)
    }

    // evaluate
    parseText(node, env) {
      exp = this.reg.exec(node.textContent).split('.')
      new Watcher(parn, val, function(newVal, oldVal) {
        node.textContent = newVal
      })
    }

    parseExp(exp, env) {
      return {
        exp: exp,
        // key chain array
        ref: []
      }
    }

    // @Exception reference error
    findAval(keyChain, env) {
      var parn = env.find(keyChain.splice(0, 1)[0])
      var child = parn
      var key
      while (keyChain.length !== 0) {
        key = keyChain.splice(0, 1)[0]
        parn = child
        child = parn[key]
      }

      return {
        parn: parn,
        key: key,
        val: child
      }
    }
  }

  class Aue {
    constructor(config) {
      this.c = config
      this.watch = config.watch || {}
      this.inited = config.inited || function() {}
      this.mounted = config.mounted || function() {}

      this._init()
      this._mount()
    }

    // Wrap data and bind watch function
    _init() {
      this.c.el = getDOM(this.c.el)
      this.__wrapping(this.c.data, this)

      this.inited()
    }

    // Generate model
    _mount() {
      observe(this.c.data)
      new Parser(this.c.el, new Env(this.c.data, null))

      this.mounted()
    }

    __wrapping(source, target) {
      Object.keys(source).forEach(function(key) {
        Object.defineProperty(target, key, {
          enumerable: false,
          configurable: true,
          get() {
            return source[key]
          },
          set(newVal) {
            var oldVal = source[key]
            source[key] = newVal
            if (typeof target.watch[key] === 'function') {
              target.watch[key].call(target, newVal, oldVal)
            }
          }
        })
      })
    }
  }

  function getDOM(o) {
    return typeof o === 'string' ? document.getElementById(o) : o
  }

  function observe(dataSet) {
    Object.keys(dataSet).forEach(function(key) {
      var val = dataSet[key]
      if (typeof val === 'object' && (! Array.isArray(val))) {
        observe(val)
      } else {
        defineAModel(dataSet, key)
      }
    })
  }

  function defineAModel(dataSet, key) {
    var val = dataSet[key]
    var dep = new Dep()
    Object.defineProperty(dataSet, key, {
      enumerable: true,
      configurable: true,
      get: function() {
        if (Watcher.watcher) {
          dep.push(Watcher.watcher)
        }
        return val
      },
      set: function(newVal) {
        val = newVal
        dep.notify(val)
      }
    })
  }
})(window)
