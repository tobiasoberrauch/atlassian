'use strict';

const config = require('../config.json');
const util = require('util');
const async = require('async');
const forever = require('forever');
const monitor = require('forever-monitor');

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let mainWindow = null;

function startServer(module, next) {
    module.child = new (monitor.Monitor)(module.script, module);

    module.child.on('start', function () {
        next(null, module);
    });
    module.child.start();
}

function startApp(modules) {
    let protocol = 'http';
    let host = 'localhost';
    let port = 3000;

    app.on('ready', function () {
        mainWindow = new BrowserWindow({
            width: 1280,
            height: 768,
            webPreferences: {
                nodeIntegration: true
            }
        });
        let url = util.format('%s://%s:%s', protocol, host, port);
        console.log(url);
        mainWindow.loadURL(url);

        mainWindow.on('closed', function () {
            mainWindow = null;
        });
    });
    app.on('window-all-closed', function () {
        app.quit();
    });

}

async.map(config.modules, startServer, function (err, modules) {
    if (!err) {
        startApp(modules);
    }
});


