'use strict';

module.exports.unpack = unpack;

////

let execFileSync = require('child_process').execFileSync;
let debug = require('debug')('recompress');
let File = require('./file');

const config = require('easy-config');
const gzipBin = config.gzip || '/usr/bin/gzip';

function unpack(file) {
    debug('ungzip', file);
    try {
        let dir = File.createTmpDir();
        execFileSync(gzipBin, ['-dk', file], {cwd: dir}).toString('utf8');
        return dir;
    } catch(e) {
        return false;
    }
}