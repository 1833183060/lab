'use strict';

const express = require('express');
const fs = require('fs');
const PORT = 2333;

const app = express();

app.use(express.static('.'));
var a = 0;
fs.watchFile('index.html', function() {
    console.log(a++)
})
app.listen(PORT);

console.log('Running on http://localhost:' + PORT);


