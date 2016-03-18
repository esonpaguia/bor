var bunyan = require('bunyan');

bunyan.emitErrs = true;

var logger = bunyan.createLogger({
    name: "bor-app",
    streams: [
        {
            stream: process.stdout,
            level: 'debug'
        },
        {
            path: './logs/bunyan.log',
            level: 'info'
        }                      
    ]
});

module.exports = logger;