/*
 * Status
 * Handler
 * Executor
 * */
const PENDING = 0
const FULFILLED = 1
const REJECTED = 2

const executorHandler = (promise, status) => data => {
  if (promise.status !== PENDING)
    return false

  setTimeout(() => {
    promise._status = status
    promise._result = data
  })
}
class Promise {
  constructor (executor) {
    this._status = PENDING
    this._result = undefined

    executor(executorHandler(this, FULFILLED), executorHandler(this, REJECTED))
  }

  then(resolve, reject) {
    resolve = resolve || function() {}
    reject = reject || function() {}

    switch(this._status) {
      case FULFILLED:
        resolve(this._result)
        break
      case REJECTED:
        reject(this._result)
        break
    }
  }
  
  catch() {
  }
}

