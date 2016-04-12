'use strict';

(function (e) {

    e.tar = tar;
    e.create = create;
    e.shasum = shasum;

}(module.exports));

////////

let execFileSync = require('child_process').execFileSync;
let debug = require('debug')('recompress');
let File = require('./file');
let path = require('path');

const config = require('easy-config');
const tarBin = config.tar || '/usr/bin/tar';

function create(dir, file) {
    debug('create tar from dir', dir);
    let files = File.readDir(dir);
    let tarName = file.substr(0, file.length - path.extname(file).length) + '.tar';

    tar(tarName, files, dir);
    return tarName;
}

function tar(name, files, dir) {
    if(dir) {
        files = files.map(file => file.replace(dir + '/', ''));
    }
    debug('tar', name, dir, files);
    execFileSync(tarBin, ['-cf', name].concat(files), {cwd: dir || process.cwd()});
}

function shasum(file) {
    return File.shasum(file);
}