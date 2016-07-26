// require('./vendor/nw-boilerplate/menu');
// var gui = global.window.nwDispatcher.requireNwGui();

var gui = require('nw.gui'); 

var win = gui.Window.open('https://www.steedos.com/steedos/springboard/', {
    title:'Steedos',
    icon: 'icon.png',
    width: 1000,
    height: 600,
    min_width: 800,
    min_height: 400,
    position: 'center'
});

cos = {}
cos.require = function (module){
    if (win.window && win.window.location && win.window.location.host.endsWith(".steedos.com"))
        return require(module);
}

win.on("loaded", function(){
    if (win.window){
        win.window.cos = cos
    }
})