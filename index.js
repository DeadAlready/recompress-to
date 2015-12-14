'use strict';

let folder = process.argv[2];

let debug = require('debug')('recompress');

let XZ = require('./lib/xz');
let File = require('./lib/file');
let pretty = require('prettysize');
let prettyMs = require('pretty-ms');

let regex = new RegExp(process.argv[3] || '.');

let start = Date.now();
let total = File
    .recursiveRead(folder)
    .filter(file => regex.test(file))
    .map(XZ.toXz)
    .reduce((sum, el) => sum + el);

console.log('Time taken:', prettyMs(Date.now() - start));
console.log('Total saved:', pretty(total));
