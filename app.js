process.env.PWD = process.env.PWD || process.cwd();

var http = require('http');
var path = require('path');
var os = require('os');

var express = require('express');
var bodyParser = require('body-parser');
var compression = require('compression');
var cookieParser = require('cookie-parser');
var errorHandler = require('errorhandler');
var morgan = require('morgan');

var atlassian = require('atlassian-connect-express');
var expiry = require('static-expiry');

var staticDir = path.join(__dirname, 'public');
var viewsDir = __dirname + '/views';
var routes = require('./routes');

var app = express();
var addon = atlassian(app);
var port = addon.config.port();
var devEnv = app.get('env') == 'development';

// The following settings applies to all environments
app.set('port', port);
app.set('views', viewsDir);

// twig
var twig = require('twig');
app.set('view engine', 'twig');
app.set('twig options', {
    strict_variables: false
});


app.use(morgan(devEnv ? 'dev' : 'combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(compression());

app.use(addon.middleware());
app.use(expiry(app, {
    dir: staticDir,
    debug: devEnv
}));

// Mount the static resource dir
app.use(express.static(staticDir));

// Show nicer errors when in dev mode
if (devEnv) {
    app.use(errorHandler());
}

routes(app, addon);

// Boot the damn thing
http.createServer(app).listen(port, function () {
    console.log('Add-on server running at http://' + os.hostname() + ':' + port);

    if (devEnv) {
        addon.register();
    }
});
