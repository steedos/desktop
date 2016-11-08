'use strict';

var Q = require('q');
var gulpUtil = require('gulp-util');
var childProcess = require('child_process');
var jetpack = require('fs-jetpack');
var utils = require('./utils');

var projectDir;
var releasesDir;
var tmpDir;
var finalAppDir;
var manifest;

var init = function () {
    projectDir = jetpack;
    tmpDir = projectDir.dir('./tmp', { empty: true });
    releasesDir = projectDir.dir('./releases');
    manifest = projectDir.read('app/package.json', 'json');
    finalAppDir = tmpDir.cwd(manifest.productName + '.app');

    return Q();
};

var copyRuntime = function () {
    return projectDir.copyAsync('node_modules/nw/nwjs/nwjs.app', finalAppDir.path());
};

var copyBuiltApp = function () {
    return projectDir.copyAsync('build', finalAppDir.path('Contents/Resources/app.nw'));
};

var cleanupRuntime = function() {
    finalAppDir.remove('Contents/Resources/default_app');
    finalAppDir.remove('Contents/Resources/atom.icns');
    return Q();
};

var finalize = function () {
    // Prepare main Info.plist
    var info = projectDir.read('resources/osx/Info.plist');
    info = utils.replace(info, {
        productName: manifest.productName,
        // identifier: manifest.identifier,
        version: manifest.version
    });
    finalAppDir.write('Contents/Info.plist', info);

    // Remove i18n files, otherwise the app will always named as nwjs
    finalAppDir.find("Contents/Resources", {
        matching: '*.lproj'
    }).forEach(function(dir_name){
        finalAppDir.remove(dir_name + "/InfoPlist.strings");
    });

    // Prepare Info.plist of Helper apps
    [' EH', ' NP', ''].forEach(function (helper_suffix) {
        info = projectDir.read('resources/osx/helper_apps/Info' + helper_suffix + '.plist');
        info = utils.replace(info, {
            productName: manifest.productName,
            identifier: manifest.identifier
        });
        finalAppDir.write('Contents/Frameworks/nwjs Helper' + helper_suffix + '.app/Contents/Info.plist', info);
    });

    // Copy icon
    projectDir.copy('resources/osx/icon.icns', finalAppDir.path('Contents/Resources/icon.icns'));

    return Q();
};

var renameApp = function() {
    // Rename helpers
    // [' Helper EH', ' Helper NP', ' Helper'].forEach(function (helper_suffix) {
    //     finalAppDir.rename('Contents/Frameworks/nwjs' + helper_suffix + '.app/Contents/MacOS/nwjs' + helper_suffix, manifest.productName + helper_suffix );
    //     finalAppDir.rename('Contents/Frameworks/nwjs' + helper_suffix + '.app', manifest.productName + helper_suffix + '.app');
    // });
    // Rename application
    finalAppDir.rename('Contents/MacOS/nwjs', manifest.productName);
    return Q();
}

var signApp = function () {
    var identity = utils.getSigningId();
    if (identity) {
        var cmd = 'codesign --deep --force --sign "' + identity + '" "' + finalAppDir.path() + '"';
        gulpUtil.log('Signing with:', cmd);
        return Q.nfcall(childProcess.exec, cmd);
    } else {
        return Q();
    }
}

var packToDmgFile = function () {
    var deferred = Q.defer();

    var appdmg = require('appdmg');
    var dmgName = manifest.name + '_' + manifest.version + '.dmg';

    // Prepare appdmg config
    var dmgManifest = projectDir.read('resources/osx/appdmg.json');
    dmgManifest = utils.replace(dmgManifest, {
        productName: manifest.productName,
        appPath: finalAppDir.path(),
        dmgIcon: projectDir.path("resources/osx/dmg-icon.icns"),
        dmgBackground: projectDir.path("resources/osx/dmg-background.png")
    });
    tmpDir.write('appdmg.json', dmgManifest);

    // Delete DMG file with this name if already exists
    releasesDir.remove(dmgName);

    gulpUtil.log('Packaging to DMG file...');

    var readyDmgPath = releasesDir.path(dmgName);
    appdmg({
        source: tmpDir.path('appdmg.json'),
        target: readyDmgPath
    })
    .on('error', function (err) {
        console.error(err);
    })
    .on('finish', function () {
        gulpUtil.log('DMG file ready!', readyDmgPath);
        deferred.resolve();
    });

    return deferred.promise;
};

var cleanClutter = function () {
    return tmpDir.removeAsync('.');
};

module.exports = function () {
    return init()
    .then(copyRuntime)
    .then(copyBuiltApp)
    .then(cleanupRuntime)
    .then(finalize)
    .then(renameApp)
    .then(signApp)
    .then(packToDmgFile)
    .then(cleanClutter)
    .catch(console.error);
};
