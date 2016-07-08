// This is main process of Electron, started as first thing when your
// app starts. This script is running through entire life of your application.
// It doesn't have any windows which you can see on screen, but we can open
// window from here.
'use strict';

var app = require('app');
var ipc = require('ipc');
var path = require('path');
var BrowserWindow = require('browser-window');
var env = require('./vendor/electron_boilerplate/env_config');
var devHelper = require('./vendor/electron_boilerplate/dev_helper');
var windowStateKeeper = require('./vendor/electron_boilerplate/window_state');

var mainWindow;

// Preserver of the window size and position between app launches.
var mainWindowState = windowStateKeeper('main', {
    width: 1000,
    height: 600
});

app.on('ready', function () {

    mainWindow = new BrowserWindow({
        title: app.getName(),
        x: mainWindowState.x,
        y: mainWindowState.y,
        'node-integration': false,
        'preload': path.resolve(path.join(__dirname, 'preload.js')),
        'web-preferences': {
            'web-security': false
        },
        // 自动隐藏菜单栏
        autoHideMenuBar: true,
        width: mainWindowState.width,
        height: mainWindowState.height
    });

    if (mainWindowState.isMaximized) {
        mainWindow.maximize();
    }

    if (env.name === 'test') {
        mainWindow.loadUrl('file://' + __dirname + '/spec.html');
    } else {
        //mainWindow.loadUrl('file://' + __dirname + '/app.html');
        mainWindow.loadUrl('https://cn.steedos.com');
    }
    
    if (process.platform == 'darwin') {
        devHelper.setDevMenu();
    }
    if (env.name !== 'production') {
        mainWindow.openDevTools();
    }

    mainWindow.on('close', function () {
        mainWindowState.saveState(mainWindow);
    });
});

app.on('window-all-closed', function () {
    app.quit();
});


ipc.on('unread-changed', function(event, unread) {
    mainWindow.flashFrame(true);
});

