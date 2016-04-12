'use strict';

module.exports.unpack = unpack;

////

let execFileSync = require('child_process').execFileSync;
let debug = require('debug')('recompress');
let File = require('./file');

const config = require('easy-config');
const unrarBin = config.unrar || '/usr/local/bin/unrar';

function unpack(file) {
    debug('unrar', file);
    let dir = File.createTmpDir();
    execFileSync(unrarBin, ['x', file], {cwd: dir}).toString('utf8');
    return dir;
}