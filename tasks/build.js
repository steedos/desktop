'use strict';

const gulp = require('gulp');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const less = require('gulp-less');
const jetpack = require('fs-jetpack');
const { series, parallel, watch } = require('gulp');

const utils = require('./utils');

const projectDir = jetpack;
const srcDir = projectDir.cwd('./app');
const destDir = projectDir.cwd('./build');

const paths = {
    jsCodeToTranspile: [
        'app/**/emailjs*/src/*.js'
    ],
    copyFromAppDir: [
        './node_modules/**',
        './vendor/**',
        './images/**',
        './icons/**',
        './stylesheets/**/*.css',
        './fonts/**',
        './vbs/**',
        './**/*.html'
    ],
};

// -------------------------------------
// Task Functions
// -------------------------------------

function clean() {
    return destDir.dirAsync('.', { empty: true });
}

function copy() {
    projectDir.copy('resources/icon.png', destDir.path('icon.png'), { overwrite: true });
    return projectDir.copyAsync('app', destDir.path(), {
        overwrite: true,
        matching: paths.copyFromAppDir
    });
}

function copyWatch() {
    return copy();
}

function transpile() {
    return gulp.src(paths.jsCodeToTranspile)
        .pipe(sourcemaps.init())
        .pipe(babel({}))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(destDir.path()));
}

function transpileWatch() {
    return transpile();
}

function compileLess() {
    return gulp.src('app/stylesheets/main.less')
        .pipe(less())
        .pipe(gulp.dest(destDir.path('stylesheets')));
}

function lessWatch() {
    return compileLess();
}

function finalize() {
    const manifest = srcDir.read('package.json', 'json');
    switch (utils.getEnvName()) {
        case 'production':
            manifest.window.toolbar = false;
            break;
        case 'test':
            manifest.name += '-test';
            manifest.main = 'spec.html';
            break;
        case 'development':
            manifest.name += '-dev';
            break;
    }
    destDir.write('package.json', manifest);

    const configFilePath = projectDir.path('config/env_' + utils.getEnvName() + '.json');
    destDir.copy(configFilePath, 'env_config.json');
    return Promise.resolve();
}

function watchFiles() {
    watch(paths.jsCodeToTranspile, transpileWatch);
    watch(paths.copyFromAppDir, { cwd: 'app' }, copyWatch);
    watch('app/**/*.less', lessWatch);
}

// -------------------------------------
// Task Composition
// -------------------------------------

const build = series(
    clean,
    parallel(
        compileLess,
        series(
            copy,
            transpile
        ),
        finalize
    )
);

// -------------------------------------
// Exports
// -------------------------------------

module.exports = {
    clean,
    copy,
    copyWatch,
    transpile,
    transpileWatch,
    less: compileLess,
    lessWatch,
    finalize,
    watch: watchFiles,
    build,
    default: build
  };