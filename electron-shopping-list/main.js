const electron = require('electron');
const url = require('url');
const path = require('path');

const { app, BrowserWindow, Menu, ipcMain } = electron;

process.env.NODE_ENV = 'production';

let mainWindow;

app.on('ready', () => {
	mainWindow = new BrowserWindow({});

	mainWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'mainWindow.html'),
		protocol: 'file:',
		slashes: true
	}));

	mainWindow.on('closed', () => {
		app.quit();
	})

	const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);

	Menu.setApplicationMenu(mainMenu);
});

function createAddWindow () {
	addWindow = new BrowserWindow({
		width: 300,
		height: 200,
		title: 'Add Shopping List Item'
	});

	addWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'addWindow.html'),
		protocol: 'file:',
		slashes: true
	}));

	addWindow.on('closed', () => {
		addWindow = null;
	});
}

ipcMain.on('item:add', (e, item) => {
	mainWindow.webContents.send('item:add', item);
	addWindow.close();
});

const mainMenuTemplate = [
	{
		label: 'File',
		submenu: [
			{
				label: 'Add Item',
				click () {
					createAddWindow();
				}
			},
			{
				label: 'Clear Item',
				click() {
					mainWindow.webContents.send('item:clear');
				}
			},
			{
				label: 'Quit',
				accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
				click () {
					app.quit();
				}
			},
		]
	}
];

if (process.platform == 'darwin') {
	mainMenuTemplate.unshift({});
}

if (process.env.NODE_ENV !== 'production') {
	mainMenuTemplate.push({
		label: 'Developer Tools',
		submenu: [
			{
				label: 'Toggle DevTools',
				accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
				click(item, focusedWindow) {
					focusedWindow.toggleDevTools();
				}
			},
			{
				role: 'reload'
			}
		]
	})
}