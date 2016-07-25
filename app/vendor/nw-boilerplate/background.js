// require('./vendor/nw-boilerplate/menu');
// var gui = global.window.nwDispatcher.requireNwGui();

// require('./vendor/nw-boilerplate/menu');

var gui = require('nw.gui'); 
var web = gui.Window.get();

web.hide();

// web.removeAllListeners('hide');

// var win = gui.Shell.openExternal('https://www.steedos.com/steedos/springboard');

var win = gui.Window.open('https://www.steedos.com/steedos/springboard/', {
    title:'Steedos',
    icon: 'icon.png',
    width: 1000,
    height: 600,
    min_width: 800,
    min_height: 400,
    position: 'center'
});


win.notifier = {};
win.path = {};

win.notifier = require('node-notifier');
win.path = require('path');