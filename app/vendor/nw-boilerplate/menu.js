
var gui = require('nw.gui');
var win = gui.Window.get();

// Create default menu items for OSX
if (process.platform === 'darwin') {
    var mb = new gui.Menu({ type: "menubar" });
    mb.createMacBuiltin(gui.App.manifest.productName);   
    win.menu = mb;
    //菜单栏国际化
    var language = window.navigator.language; 
    var viewMenu = new gui.Menu();
    var helpMenu = new gui.Menu();
    if (language.indexOf('zh') > -1)
    {
        var reloadItem = new gui.MenuItem({
            label: '重新载入',
            click: function() {
                win.reload();
            },
            modifiers: "cmd+R"
        });
        var fullscreenItem = new gui.MenuItem({
            label: '进入全屏幕',
            click: function() {
                if (win.isFullscreen)
                    win.leaveFullscreen();
                else
                    win.enterFullscreen();
            },
            modifiers: "ctrl+cmd+F"
        });
        var developToggleItem = new gui.MenuItem({
            
            label: '开发者工具',
            click: function() {
                if (win.isDevToolsOpen())
                    win.closeDevTools();
                else 
                    win.showDevTools();
            },
            modifiers: "alt+cmd+I"
        });
        var steedoshelpItem = new gui.MenuItem({
            
            label: '华炎云帮助',
            click: function() {
                window.open('https://www.steedos.com/cn/help/');
            }
        });        
        //菜单栏添加'显示'
        win.menu.append(new gui.MenuItem({
            label: '显示',
            submenu: viewMenu
        }));
        //菜单栏添加'帮助'
        win.menu.append(new gui.MenuItem({
            label: '帮助',
            submenu: helpMenu
        }))
    }else{
        var reloadItem = new gui.MenuItem({
            label: 'Reload',
            click: function() {
                win.reload();
            },
            modifiers: "cmd+R"
        });
        var fullscreenItem = new gui.MenuItem({
            label: 'Enter Full Screen',
            click: function() {
                if (win.isFullscreen)
                    win.leaveFullscreen();
                else
                    win.enterFullscreen();
            },
            modifiers: "ctrl+cmd+F"
        });
        var developToggleItem = new gui.MenuItem({
            
            label: 'Toggle Dev Tools',
            click: function() {
                if (win.isDevToolsOpen()){
                    win.closeDevTools();
                }else{ 
                    win.showDevTools();
                }
            },
            modifiers: "alt+cmd+I"
        });
        var steedoshelpItem = new gui.MenuItem({
            
            label: 'Steedos Help',
            click: function() {
                window.open('https://www.steedos.com/us/help/');
            }
        }); 

        win.menu.append(new gui.MenuItem({
            label: 'View',
            submenu: viewMenu
        }));

        win.menu.append(new gui.MenuItem({
            label: 'Help',
            submenu: helpMenu
        }))
    }
    
    viewMenu.append(reloadItem);
    viewMenu.append(fullscreenItem);
    viewMenu.append(new gui.MenuItem({ type: 'separator' }));
    viewMenu.append(developToggleItem);
    helpMenu.append(steedoshelpItem);
    


}