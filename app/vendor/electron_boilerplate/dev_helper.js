'use strict';

var app = require('app');
var Menu = require('menu');
var BrowserWindow = require('browser-window');

module.exports.setDevMenu = function () {    
	var Template_en = 
	[
		{
		    label: 'Menu',
		    submenu: 
		    [
			    {
			        label: 'Reload',
			        accelerator: 'CmdOrCtrl+R',
			        click: function () {
			            BrowserWindow.getFocusedWindow().reloadIgnoringCache();
			        }
			    },{
			        label: 'Toggle DevTools',
			        accelerator: 'Alt+CmdOrCtrl+I',
			        click: function () {
			            BrowserWindow.getFocusedWindow().toggleDevTools();
			        }
			    },{
			        label: 'Quit',
			        accelerator: 'CmdOrCtrl+Q',
			        click: function () {
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
	    }
    ];

    var Template_zh = 
    [
	    {
	        label: '菜单',
	        submenu: [{
	            label: '重启',
	            accelerator: 'CmdOrCtrl+R',
	            click: function () {
	                BrowserWindow.getFocusedWindow().reloadIgnoringCache();
	            }
	        },{
	            label: '切换开发工具',
	            accelerator: 'Alt+CmdOrCtrl+I',
	            click: function () {
	                BrowserWindow.getFocusedWindow().toggleDevTools();
	            }
	        },{
	            label: '退出',
	            accelerator: 'CmdOrCtrl+Q',
	            click: function () {
	                app.quit();
	            }
	        }]
	    },
	    {
	        label: '编辑',
	    	submenu: [
	      	{
	        	label: '撤销',
	        	accelerator: 'CmdOrCtrl+Z',
	        	role: 'undo'
	      	},
	      	{
	        	label: '下一步',
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
	        	label: '复制',
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
	      	}]
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
