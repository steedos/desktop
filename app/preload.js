
global.electron = {};
global.electron.ipc = require('ipc')
global.electron.remote = require('remote');
global.electron.notifier = require('node-notifier');

var events = ['unread-changed'];

events.forEach(function(e) {
    window.addEventListener(e, function(event) {
        electron.ipc.send(e, event.detail);
    });
});