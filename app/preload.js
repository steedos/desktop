var path = require('path');

global.electron = {};
global.electron.ipc = require('ipc')
global.electron.remote = require('remote');
global.electron.notifier = require('node-notifier');

global.electron.icon = path.join(__dirname, '../../icon.png')

var events = ['unread-changed'];

events.forEach(function(e) {
    window.addEventListener(e, function(event) {
        electron.ipc.send(e, event.detail);
    });
});