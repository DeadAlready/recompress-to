'use strict';

module.exports.unpack = unpack;

////

let execFileSync = require('child_process').execFileSync;
let debug = require('debug')('recompress');
let File = require('./file');

function unpack(file) {
    debug('unzip', file);
    let dir = File.createTmpDir();
    execFileSync('/usr/bin/unzip', [file], {cwd: dir}).toString('utf8');
    return dir;
}