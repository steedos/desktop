'use strict';

var app = require('app');
var Menu = require('menu');
var BrowserWindow = require('browser-window');
var shell = require('shell');


module.exports.setDevMenu = function () {    
	var Template_en = 
	[
		{
		    label: 'Menu',
		    submenu: 
		    [
			    {
			        label: 'About Steedos',
			        role: 'about',
			    },			   			    		 
			    {
			        type: 'separator'
			    
			    },			    
			    {
			        label: 'Hide Steedos',
			        accelerator: 'Command+H',
			        role: 'hide',
			    },
			    {
			        label: 'Hide Others',
			        accelerator: 'Command+Shift+H',
			        role: 'hideothers'
			    },
			    {
			        label: 'Show All',
			        role: 'unhide',
			    },
			    {
			        type: 'separator'
			    },
			    {
			        label: 'Quit',
			        accelerator: 'CmdOrCtrl+Q',
			        click: function () 
			        {
			            app.quit();
			        }
			    }
		    ]
		},
	    {
	        label: 'Edit',
	    	submenu: 
	    	[
		      	{
		        	label: 'Undo',
		        	accelerator: 'CmdOrCtrl+Z',
		        	role: 'undo'
		      	},
		      	{
		        	label: 'Redo',
		        	accelerator: 'Shift+CmdOrCtrl+Z',
		        	role: 'redo'
		      	},
		      	{
		        	type: 'separator'
		      	
		      	},
		      	{
		        	label: 'Cut',
		        	accelerator: 'CmdOrCtrl+X',
		        	role: 'cut'
		      	},
		      	{
		        	label: 'Copy',
		        	accelerator: 'CmdOrCtrl+C',
		        	role: 'copy'
		      	},
		      	{
		        	label: 'Paste',
		        	accelerator: 'CmdOrCtrl+V',
		        	role: 'paste'
		      	},
		      	{
		        	label: 'Select All',
		        	accelerator: 'CmdOrCtrl+A',
		        	role: 'selectall'
		      	}
	    	]
	    },
	    {
	        label: 'View',
	    	submenu: 
	    	[
		      	{
			        label: 'Reload',
			        accelerator: 'CmdOrCtrl+R',
			        click: function () 
			        {
			            BrowserWindow.getFocusedWindow().reloadIgnoringCache();
			        }
			    },		      	
	        	{
			        type: 'separator'
	        	},
	        	{
			        label: 'Toggle DevTools',
			        accelerator: 'Alt+CmdOrCtrl+I',
			        click: function () 
			        {
			            BrowserWindow.getFocusedWindow().toggleDevTools();
			        }
			    },
			    {
			        type: 'separator'
	        	},			    		      	
	    	]
	    },
	    {
		    label: 'Window',
		    role: 'window',
		    submenu: 
		    [
		      	{
		        	label: 'Minimize',
		        	accelerator: 'CmdOrCtrl+M',
		        	role: 'minimize'
		      	},		      	
		      	{
		        	label: 'Close',
		        	accelerator: 'CmdOrCtrl+W',
		        	role: 'close'
		      	},
		      	{
		      		label: 'Enter Full Screen',
        			accelerator: 'Ctrl+Command+F',
	        		click: function(item, focusedWindow) 
	        		{
	          			if (focusedWindow)
	          			{
	            			focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
	        			}
	        		}
	        	}
		    ]
		},
		{
		    label: 'Help',
		    role: 'help',
		    submenu: 
		    [
		      	{
		        	label: 'Steedos Help',
		        	click: function() 
		        	{ 
		        		shell.openExternal('https://cn.steedos.com/us/help/');
		        	}
		      	},
		    ]
		}
    ];

    var Template_zh = 
    [
	    {
	        label: '菜单',
	        submenu: 
	        [
		        {
			        label: '关于华炎云',
			        role: 'about'
			    },		      		        		        		    
			    {
			        type: 'separator'
			    
			    },			   			   
			    {
			        label: '隐藏华炎云',
			        accelerator: 'Command+H',
			        role: 'hide'
			    },
			    {
			        label: '隐藏其他应用',
			        accelerator: 'Command+Shift+H',
			        role: 'hideothers'
			    },
			    {
			        label: '显示全部',
			        role: 'unhide'
			    },
			    {
			        type: 'separator'
			    },
			    {
		            label: '退出华炎云',
		            accelerator: 'CmdOrCtrl+Q',
		            click: function () 
		            {
		                app.quit();
		            }
		        },
	        ]
	    },
	    {
	        label: '编辑',
	    	submenu: 
	    	[
		      	{
		        	label: '撤销',
		        	accelerator: 'CmdOrCtrl+Z',
		        	role: 'undo'
		      	},
		      	{
		        	label: '重做',
		        	accelerator: 'Shift+CmdOrCtrl+Z',
		        	role: 'redo'
		      	},
		      	{
		        	type: 'separator'
		      	},
		      	{
		        	label: '剪切',
		        	accelerator: 'CmdOrCtrl+X',
		        	role: 'cut'
		      	},
		      	{
		        	label: '拷贝',
		        	accelerator: 'CmdOrCtrl+C',
		        	role: 'copy'
		      	},
		      	{
		        	label: '粘贴',
		        	accelerator: 'CmdOrCtrl+V',
		        	role: 'paste'
		      	},
		      	{
		        	label: '全选',
		        	accelerator: 'CmdOrCtrl+A',
		        	role: 'selectall'
		      	}
	      	]
	    },
	    {
	        label: '显示',
	    	submenu: 
	    	[
		      	{
			        label: '重新载入',
			        accelerator: 'CmdOrCtrl+R',
			        click: function () 
			        {
			            BrowserWindow.getFocusedWindow().reloadIgnoringCache();
			        }
			    },		      	
	        	{
			        type: 'separator'
	        	},
		        {
		            label: '开发者工具',
		            accelerator: 'Alt+CmdOrCtrl+I',
		            click: function () 
		            {
		                BrowserWindow.getFocusedWindow().toggleDevTools();
		            }
		        },
		        {
			        type: 'separator'
	        	}		              	
	    	]
	    },
	    {
		    label: '窗口',
		    role: 'window',
		    submenu: 
		    [
		      	{
		        	label: '最小化',
		        	accelerator: 'CmdOrCtrl+M',
		        	role: 'minimize'
		      	},		      	
		      	{
		        	label: '关闭',
		        	accelerator: 'CmdOrCtrl+W',
		        	role: 'close'
		      	},
		      	{
		      		label: '进入全屏幕',
        			accelerator: 'Ctrl+Command+F',
	        		click: function(item, focusedWindow) 
	        		{
	          			if (focusedWindow)
	          			{
	            			focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
	        			}
	        		}
	        	}	
		    ]
		},
		{
    		label: '帮助',
    		role: 'help',
    		submenu: 
    		[
      			{
        			label: '华炎云帮助',
        			click: function ()
					{
            			shell.openExternal('https://cn.steedos.com/cn/help/');
        			}
      			},
    		]
  		}
    ];
    
	var lang = app.getLocale();
	console.log(lang);

	// 中文
	if (lang == "zh-CN")
	{
		var menu = Menu.buildFromTemplate(Template_zh);
		Menu.setApplicationMenu(menu);
	}
	// 其他
	else
	{
		var menu = Menu.buildFromTemplate(Template_en);
		Menu.setApplicationMenu(menu);
	}
    
};
