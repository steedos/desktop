'use strict';

var Q = require('q');
var gulpUtil = console;
var childProcess = require('child_process');
var jetpack = require('fs-jetpack');
var utils = require('./utils');
const rcedit = require('rcedit');
const fs = require('fs');

var projectDir;
var tmpDir;
var releasesDir;
var readyAppDir;
var manifest;

var init = function () {
    projectDir = jetpack;
    tmpDir = projectDir.dir('./tmp', { empty: true });
    releasesDir = projectDir.dir('./releases');
    manifest = projectDir.read('app/package.json', 'json');
    readyAppDir = tmpDir.cwd(manifest.name);

    return Q();
};

var copyRuntime = function () {
    return projectDir.copyAsync('node_modules/nw/nwjs-sdk-v0.98.2-win-x64', readyAppDir.path(), { overwrite: true });
};

var copyBuiltApp = function () {
    return projectDir.copyAsync('build', readyAppDir.path(), { overwrite: true });
};

var prepareOsSpecificThings = function () {
    return projectDir.copyAsync('resources/windows/icon.ico', readyAppDir.path('icon.ico'));
};

var finalize = function () {
    return Q.Promise(async (resolve, reject) => {
        const exePath = readyAppDir.path('nw.exe');
        const iconPath = projectDir.path('resources/windows/icon.ico');

        // 增强文件检查
        try {
            await fs.promises.access(exePath, fs.constants.W_OK);
            await fs.promises.access(iconPath, fs.constants.R_OK);
        } catch (err) {
            return reject(new Error(`File access error: ${err.message}`));
        }

        // 新版 rcedit 支持 Promise
        try {
            await rcedit(exePath, {
                'icon': iconPath,
                'version-string': {
                    'ProductName': manifest.productName,
                    'FileDescription': manifest.description,
                }
            });
            console.log('✓ Executable modified successfully');
            resolve();
        } catch (err) {
            console.error('✗ rcedit failed:', err);
            reject(err);
        }
    }).timeout(10000, 'rcedit timed out after 10 seconds');
};

var renameApp = function () {
    return readyAppDir.renameAsync('nw.exe', manifest.name + '.exe');
};

var createInstaller = function () {
    var deferred = Q.defer();

    var finalPackageName = manifest.name + '_' + manifest.version + '.exe';
    var installScript = projectDir.read('resources/windows/installer.nsi');
    installScript = utils.replace(installScript, {
        name: manifest.name,
        productName: manifest.productName,
        version: manifest.version,
        src: readyAppDir.path(),
        dest: releasesDir.path(finalPackageName),
        icon: readyAppDir.path('icon.ico'),
        setupIcon: projectDir.path('resources/windows/setup-icon.ico'),
        banner: projectDir.path('resources/windows/setup-banner.bmp'),
    });
    tmpDir.write('installer.nsi', installScript);

    gulpUtil.log('Building installer with NSIS...');

    // Remove destination file if already exists.
    releasesDir.remove(finalPackageName);

    // Note: NSIS have to be added to PATH (environment variables).
    var nsis = childProcess.spawn('makensis', [tmpDir.path('installer.nsi')]);
    nsis.stdout.pipe(process.stdout);
    nsis.stderr.pipe(process.stderr);
    nsis.on('close', function () {
        gulpUtil.log('Installer ready!', releasesDir.path(finalPackageName));
        deferred.resolve();
    });

    return deferred.promise;
};

var cleanClutter = function () {
    return tmpDir.removeAsync('.');
};

module.exports = function (done) {
    console.log('Starting Windows release process...');
    return init()
        .then(() => console.log('Initialization complete'))
        .then(copyRuntime)
        .then(() => console.log('Runtime copied'))
        .then(copyBuiltApp)
        .then(() => console.log('App copied'))
        .then(prepareOsSpecificThings)
        .then(() => console.log('OS-specific files prepared'))
        .then(finalize)
        .then(() => console.log('Executable finalized'))
        .then(renameApp)
        .then(() => console.log('App renamed'))
        .then(createInstaller)
        .then(() => console.log('Installer created'))
        .then(cleanClutter)
        .then(() => {
            console.log('Release completed successfully');
            done();
        })
        .catch(err => {
            console.error('Release error:', err);
            done(err);
        });
};