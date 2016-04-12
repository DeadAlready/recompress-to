'use strict';

module.exports.unpack = unpack;

////

let execFileSync = require('child_process').execFileSync;
let debug = require('debug')('recompress');
let File = require('./file');

const config = require('easy-config');
const unzipBin = config.unzip || '/usr/bin/unzip';

function unpack(file) {
    debug('unzip', file);
    let dir = File.createTmpDir();
    execFileSync(unzipBin, [file], {cwd: dir}).toString('utf8');
    return dir;
}