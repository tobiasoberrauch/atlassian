var argv = require('minimist')(process.argv.slice(2));
var express = require('express');
var app = express();

const PORT = argv.port;

app.use(express.static(__dirname + '/public'));
app.listen(PORT, function () {
    console.log('App listening on port %s!', PORT);
});