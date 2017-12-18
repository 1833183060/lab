/*
 * A promise comes with some guarantees:
 * 1. Callbacks will never be called before the completion of the current run of the JavaScript event loop
 * 2. Callbacks added with .then even after the success or failure of the asynchronous operation will be called
 * 3. Multiple callbacks may be added by calling .then several times, to be executed independently in insertion order
 * */
function seccessCallback(res) {
  console.log('success with ' + res)
}

function failureCallback(error) {
  console.log('failed with ' + res)
}

/* Execute two or more asynchronous operations back to back */

