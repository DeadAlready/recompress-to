'use strict';

(function (e) {

    e.create = create;
    e.shasum = shasum;
    e.toXz = toXz;

}(module.exports));

////////

let execFileSync = require('child_process').execFileSync;
let debug = require('debug')('recompress');
let fs = require('fs');
let fsExtra = require('fs-extra');
let File = require('./file');
let Tar = require('./tar');
let Rar = require('./rar');
let Zip = require('./zip');
let Gzip = require('./gzip');

function create(file) {
    debug('create xz', file);
    execFileSync('/usr/local/bin/xz', ['-zk9', file]);

    return file + '.xz';
}

function decompress(file) {
    debug('decompress xz', file);
    execFileSync('/usr/local/bin/xz', ['-d', file]);

    return file.substr(0, file.length - 3);
}

function shasum(file) {
    let tmp = '/tmp/' + Math.random().toString(36).substr(2) + '.xz';

    fsExtra.copySync(file, tmp);

    let uncompressed = decompress(tmp);

    let shasum = File.shasum(uncompressed);

    fs.unlinkSync(uncompressed);

    return shasum;
}

function repack(file) {
    let tmp = '/tmp/' + Math.random().toString(36).substr(2) + '.xz';
    debug('copy xz', file, tmp);
    fsExtra.copySync(file, tmp);
    let uncompressed = decompress(tmp);
    let newCompressed = create(uncompressed);

    let shasumUn = File.shasum(uncompressed);
    let shasumN = shasum(newCompressed);
    let saved = 0;
    if(shasumN === shasumUn) {
        console.log('repack successful', file);
        saved = File.compare(file, newCompressed);
        fs.unlinkSync(file);
        fs.renameSync(newCompressed, file);
    } else {
        fs.unlinkSync(newCompressed);
    }
    fs.unlinkSync(uncompressed);
    return saved;
}

function toXz(file) {
    let dir;
    let tar;
    console.log('processing', file);
    if(file.endsWith('.rar')) {
        dir = Rar.unpack(file);
        tar = Tar.create(dir, file);
    }
    else if(file.endsWith('.zip')) {
        dir = Zip.unpack(file);
        tar = Tar.create(dir, file);
    }
    else if(file.endsWith('.gz')) {
        dir = Gzip.unpack(file);
        tar = file.substr(0, file.length - 3);
    }
    else if(file.endsWith('.xz')) {
        return repack(file);
    } else {
        console.log('unprocessable file', file);
        return 0;
    }

    let saved = 0;

    let xz = create(tar);

    let shasumTar = Tar.shasum(tar);
    let shasumXz = shasum(xz);

    debug('shasums:', shasumTar, shasumXz);
    if(shasumTar === shasumXz) {
        console.log('Transform successful', file, '->', xz);
        saved = File.compare(file, xz);
        debug('unlink original', file);
        fs.unlinkSync(file);
    } else {
        console.error('Transform failed for', file);
        debug('unlink xz', file);
        fs.unlinkSync(xz);
    }

    debug('cleanup tar and dir', tar, dir);
    fs.unlinkSync(tar);
    File.rmDir(dir);
    return saved;
}