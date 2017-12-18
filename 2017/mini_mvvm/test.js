var testObj = {}
Object.defineProperty(testObj, 'a', {
  enumerable: true,
  configurable: true,
  get: function(a) {
    console.log('get')
    return testObj._a
  },
  set: function(val) {
    testObj._a = val
    console.log('set')
  }
})

testObj.a = 1
