const tokenizer = require('../src/tokenizer.js');

const fa = 'test === true';
const fb = 'test === \'true\'';
const fc = 'test === test2';
const fd = '1 + 2';
const fe = '1+2';
const ff = '1 + test';
const fg = '1+test';

console.log(tokenizer(fa));
console.log(tokenizer(fb));
console.log(tokenizer(fc));
console.log(tokenizer(fd));
console.log(tokenizer(fe));
console.log(tokenizer(ff));
console.log(tokenizer(fg));
