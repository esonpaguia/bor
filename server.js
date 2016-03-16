var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    config = require('./config'),
    Errors = require('node-common-errors'),
    logger = require('./app/modules/bunyan-logger'),
    cookieParser = require('cookie-parser');
    session = require('express-session');

var http = require('http').Server(app);

app.use(cookieParser());
app.use(session(config.sessionConfig));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));

var api = require('./app/routes/api')(app, express);
app.use('/api', api);

app.get('*', function(req, res) {
    res.sendFile(__dirname + '/app/public/app/views/index.html');
});

app.use(Errors.commonErrorHandler);

http.listen(config.port, function(err) {
    if (err) {
        logger.error(err);
    } else {
        logger.info('Listening on port ' + config.port);
    }
});