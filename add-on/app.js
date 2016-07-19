process.env.PWD = process.env.PWD || process.cwd();

const http = require('http');
const os = require('os');
const path = require('path');

const atlassian = require('atlassian-connect-express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const errorHandler = require('errorhandler');
const expiry = require('static-expiry');
const express = require('express');
const morgan = require('morgan');
const twig = require('twig');

const staticDir = path.join(__dirname, 'public');
const viewsDir = path.join(__dirname, 'views');
const routes = require('./routes');

const app = express();
const addon = atlassian(app);
const port = addon.config.port();
const devEnv = app.get('env') == 'development';


app.set('port', port);
app.set('views', viewsDir);

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
