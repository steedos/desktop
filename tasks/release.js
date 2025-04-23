'use strict';

const gulp = require('gulp');
const { series } = require('gulp');
const utils = require('./utils');

const releaseForOs = {
    osx: require('./release_osx'),
    linux: require('./release_linux'),
    windows: require('./release_windows'),
};

function release(done) {
    console.log('release', utils.os());
    return releaseForOs[utils.os()](done);
}

// Assuming build task is exported from build.js
const build = require('./build').build;

module.exports = {
    release: series(build, release)
  };