;(function(window) {

  /*
   * 一个属性对应一个订阅器，一个订阅器中可以装有多个订阅者
   * */

  // 订阅器
  class Dep {
    constructor() {
      this.subs = []
    }

    notify() {
      this.subs.forEach(function(sub) {
        sub.update()
      })
    }

    addSub(sub) {
      this.subs.push(sub)
    }
  }

  // 订阅者
  class Watcher {
    // 所有数据，当前被订阅的数据，回调函数
    constructor(vm, exp, cb) {
      this.cb = cb
      this.vm = vm
      this.exp = exp
      this.value = this.get()
    }

    update() {
      this.run()
    }
    // 如果当前数据和旧数据不一样，调用callback
    run() {
      var value = this.vm.data[this.exp]
      var oldVal = this.value
      if (value !== oldVal) {
        this.value = value
        this.cb.call(this.vm, value, oldVal)
      }
    }
    // 获取被订阅的数据的值
    get() {
      Dep.target = this;
      var value = this.vm.data[this.exp]
      Dep.target = null
      return value
    }
  }
  function defineReactive(data, key, val) {
    observe(val)
    var dep = new Dep()
    Object.defineProperty(data, key, {
      enumerable: true,
      configurable: true,
      get: function() {
        if (Dep.target) {
          dep.addSub(Dep.target)
        }
        return val
      },
      set: function(newVal) {
        if (val === newVal) {
          return
        }
        val = newVal
        console.log(newVal.toString())
        dep.notyify()
      }
    })
  }

  function observe(data) {
    if (!data || typeof data !== 'object') {
      return
    }
    Object.keys(data).forEach(function(key) {
      defineReactive(data, key, data[key])
    })
  }

  class SelfVue {
    constructor(options) {
      var self = this
      this.vm = this
      this.data = options

      Object.keys(data).forEach(function(key) {
        self.proxyKeys(key)
      })

      observe(this.data)
      new Compile(options, this.vm)
    }
    proxyKeys(key) {
      var self = this
      Object.defineProperty(this, key, {
        enumerable: false,
        configurable: true,
        get: function proxyGetter() {
          return self.data[key]
        }
        set: function proxySetter(newVal) {
          self.data[key] = newVal
        }
      })
    }
  }

  /* Compiler */
  // 将一个DOM片段提取出来
  function nodeToFragment(el) {
    var fragment = document.createDocumentFragment()
    var child = el.firstChild
    while (child) {
      fragment.appendChild(child)
      child = el.firstChild
    }

    return fragment
  }

  // 深度优先遍历寻找DOM中引用的model
  function compileElement(el) {
    var childNodes = el.childNodes
    var self = this
    var reg = /\{\{(.*)\}\}/
    [].slice.call(childNodes).forEach(function(node) {
      var text = node.textContent

      if (self.isTextNode(node) && reg.test(text)) {
        self.compileText(node, reg.exec(text)[1])
      }

      if (node.childNodes && node.childNodes.length) {
        self.compileElement(node)
      }
    })
  }

  // 
  function compileText(node, exp) {
    var self = this
    var initText = this.vm[exp]
    updateText(node, initText)
    new Watcher(this.vm, exp, function(value) {
      self.updateText(node, value)
    })
  }

  function updateText(node, value) {
    node.textContent = typeof value == 'undefined' ? '' : value
  }

})(window)

