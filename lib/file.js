'use strict';

(function (e) {

    e.recursiveRead = recursiveRead;
    e.createTmpDir = createTmpDir;
    e.readDir = readDir;
    e.rmDir = rmDir;
    e.shasum = shasum;
    e.compare = compare;

}(module.exports));

////////

let fs = require('fs');
let rmrf = require('rmrf');
let debug = require('debug')('recompress');
let execFileSync = require('child_process').execFileSync;

const config = require('easy-config');
const shasumBin = config.shasum || '/usr/bin/shasum';

function readDir(folder) {
    if(!folder.endsWith('/')) {
        folder += '/';
    }
    debug('read folder:', folder);
    return fs.readdirSync(folder).map(file => folder + file);
}

function rmDir(folder) {
    debug('delete folder:', folder);
    rmrf(folder);
}

function recursiveRead(folder) {
    let list = readDir(folder);
    let resultList = [];
    list.forEach(file => {
        let stats = fs.lstatSync(file);
        if(!stats.isDirectory()) {
            resultList.push(file);
            return;
        }
        debug('file is dir, recurse', file);
        resultList = resultList.concat(recursiveRead(file));
    });

    return resultList;
}

function createTmpDir() {
    let name = Math.random().toString(36).substr(2);
    let folder = '/tmp/' + name;
    fs.mkdirSync(folder);
    debug('create tmp folder', folder);
    return folder;
}

function shasum(file) {
    return execFileSync(shasumBin, [file]).toString('utf8').split(' ').shift();
}

function compare(file1, file2) {
    let stat1 = fs.lstatSync(file1);
    let stat2 = fs.lstatSync(file2);

    return stat1.size - stat2.size;
}