// require('./vendor/nw-boilerplate/menu');
// var gui = global.window.nwDispatcher.requireNwGui();
require("babel-polyfill");

var gui = require('nw.gui');

var globalWindow = gui.Window.get(); 

var win = gui.Window.open('https://www.steedos.com/steedos/springboard/', {
    title:'Steedos',
    icon: 'icon.png',
    toolbar: false,
    width: 1000,
    height: 600,
    min_width: 800,
    min_height: 400,
    position: 'center'
});

cos_enabled_domain = ["127.0.0.1", "localhost", ".steedos.com", ".petrochina.com.cn"]
cos = {}
cos.require = function (module){
    if (win.window && win.window.location)
    {
        hostname = win.window.location.hostname
        for (i=0; i<cos_enabled_domain.length; i++)
            if (hostname.endsWith(cos_enabled_domain[i]))
                return require(module);
    }
    return undefined
}

cos.win_focus = function(){
    win.restore();//恢复最小化窗口
    win.focus();//获取焦点
}

// 重新载入时再次传入cos对象
win.on("loaded", function(){
    if (win.window){
        win.window.cos = cos
    }
})

//关闭华炎云时，将没有显示的主窗口关掉
win.on("close",function(){
    if(win.window){
        globalWindow.close(true)
    }
    win.close();
})
