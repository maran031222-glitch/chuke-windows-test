'use strict';
const { app,BrowserWindow,ipcMain,shell }=require('electron');
const path=require('path');
let win;
function boot(){
 win=new BrowserWindow({width:1400,height:900,minWidth:1000,minHeight:680,frame:false,show:false,title:'初刻 Windows 预览版',icon:path.join(__dirname,'assets/chuke-app-icon.png'),backgroundColor:'#f7fbfa',webPreferences:{preload:path.join(__dirname,'preload.js'),contextIsolation:true,nodeIntegration:false,sandbox:true,webSecurity:true}});
 win.once('ready-to-show',()=>win.show());
 win.loadFile('src/index.html');
 win.webContents.setWindowOpenHandler(({url})=>{if(/^https:\/\//.test(url))shell.openExternal(url).catch(()=>{});return {action:'deny'}});
 win.webContents.on('will-navigate',(event,url)=>{if(!url.startsWith('file://')){event.preventDefault();if(/^https:\/\//.test(url))shell.openExternal(url).catch(()=>{})}});
}
app.whenReady().then(()=>{ipcMain.handle('chuke:minimize',()=>win?.minimize());ipcMain.handle('chuke:toggle-maximize',()=>win&&(win.isMaximized()?win.unmaximize():win.maximize()));ipcMain.handle('chuke:close',()=>win?.close());boot();app.on('activate',()=>{if(!BrowserWindow.getAllWindows().length)boot()})});
app.on('window-all-closed',()=>{if(process.platform!=='darwin')app.quit()});
