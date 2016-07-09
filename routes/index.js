/* global module*/

module.exports = function (app, addon) {
    app.get('/', function (req, res) {
        res.format({
            'text/html': function () {
                res.redirect('/atlassian-connect.json');
            },
            'application/json': function () {
                res.redirect('/atlassian-connect.json');
            }
        });
    });

    app.get('/grow', addon.authenticate(), function (req, res) {
            res.render('grow/index', {
                title: 'Atlassian Connect'
            });
        }
    );

    app.get('/configuration', function (req, res) {
        res.render("configuration", {
            id: req.query['id'],
            type: req.query['type']
        });
    });


    // This is an example route that's used by the default "generalPage" module.
    // Verify that the incoming request is authenticated with Atlassian Connect
    app.get('/issues-in-project', addon.authenticate(), function (req, res) {
            // Rendering a template is easy; the `render()` method takes two params: name of template
            // and a json object to pass the context in

            res.render('issues-in-project', {
                dashboard: req.query['dashboard'],
                dashboardItem: req.query['dashboardItem']
            });
        }
    );

    app.get('/thumbnail', function (req, res) {
        res.sendfile('public/thumbnail.png');
    });

    app.get('/condition', addon.authenticate(), function (req, res) {
        var view = req.query['view'];
        var dashboard = req.query['dashboard'];
        var dashboardItem = req.query['dashboardItem'];
        console.log(view);
        console.log(dashboard);
        console.log(dashboardItem);
        res.status(200).send({shouldDisplay: true});
    });

    app.get('/dropdown', function(req,res){
        res.render("dropdown", {id : req.query['id'], mode : req.query['mode'] });
    });

    app.get('/web-panel', addon.authenticate(), function (request, response) {
        response.render('web-panel');
    });

    app.post('/enabled', function () {
        console.log('enabled', arguments);
    });


    var fs = require('fs');
    var path = require('path');
    var files = fs.readdirSync("routes");
    for (var index in files) {
        var file = files[index];
        if (file === "index.js") continue;
        // skip non-javascript files
        if (path.extname(file) != ".js") continue;

        var routes = require("./" + path.basename(file));

        if (typeof routes === "function") {
            routes(app, addon);
        }
    }
};
