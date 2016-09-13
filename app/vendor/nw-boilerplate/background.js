// require('./vendor/nw-boilerplate/menu');
// var gui = global.window.nwDispatcher.requireNwGui();
// require("babel-polyfill");

var gui = require('nw.gui');

var globalWindow = gui.Window.get(); 

var swal = require('sweetalert');

var win = gui.Window.open('https://www.steedos.com/steedos/springboard/', {
    title:'Steedos',
    icon: 'icon.png',
    toolbar: true,
    width: 1000,
    height: 600,
    min_width: 800,
    min_height: 400,
    position: 'center'
});

cos_enabled_domain = ["127.0.0.1", "localhost", "192.168.0.189", ".steedos.com", ".petrochina.com.cn"]
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

cos.office_signal = function(signal){
    return signal;
}

cos.officeAlert = function(){
    var local = window.navigator.language;
    if (local == "zh-cn"){
        alert("正在编辑office文档，请在编辑完成后，再关闭华炎云。");
    }else{
        alert("You are editing office document,please close Steedos after you have finished editing.");
    }
}

// 重新载入时再次传入cos对象
win.on("loaded", function(){
    win.window.cos = cos;
})

//关闭华炎云时，将没有显示的主窗口关掉
win.on("close",function(){
    if(win.window){
        if(cos.office_signal == "editing"){
            cos.officeAlert();
        }else{
            win.close(true);
            globalWindow.close(true);
        }
    }
})
