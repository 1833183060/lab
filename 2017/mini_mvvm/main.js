;(function(window) {

  class Dep {
    constructor() {
      this.subs = []
    }

    notify() {
      this.subs.forEach(function(sub) {
        sub.update()
      })
    }
  }

  class Watcher {
    constructor(vm, exp, cb) {
      this.cb = cb
      this.vm = vm
      this.exp = exp
      this.value = this.get()
    }

    update() {
      this.run()
    }
    run() {
      var value = this.vm.data[this.exp]
      var oldVal = this.value
      if (value !== oldVal) {
        this.value = value
        this.cb.call(this.vm, value, oldVal)
      }
    }
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

  function SelfVue(data, el, exp) {
    var self = this
    this.data = data

    Object.keys(data).forEach(function(key) {
      self.proxyKeys(key)
    })

    observe(data)
    el.innerHTML = this.data[exp]
    new Watcher(this, exp, function(value) {
      el.innerHTML = value
    })
    return this
  }

})(window)
