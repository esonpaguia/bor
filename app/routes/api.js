var config = require('../../config'),
    Errors = require('node-common-errors'),
    util    = require('util'),
    spawn   = require('child_process').spawn,
    carrier = require('carrier'),
    Errors = require('common-errors'),
    dateFormat = require('dateformat'),
    logger = require('../modules/bunyan-logger');

function logDebug(req, msg) {
    logger.debug({ 'session-id': req.session.id}, msg);
}

function logInfo(req, msg) {
    logger.info({ 'session-id': req.session.id}, msg);
}

function logError(req, err) {
    logger.error({ 'session-id': req.session.id}, err);
}

function handleError(req, res, err) {
    logError(req,err);
    res.status(403).send({ success: false, message: err});
    return;
}

module.exports = function(app, express) {
    
    var api = express.Router();
    
    api.get('/ping', function(req, res) {
        
        res.send('pong');
        
    })
    
    api.post('/find', function(req, res) {
        
        var application = req.body.application,
            timezone = req.body.timezone,
            startdatetime = req.body.startdatetime,
            enddatetime = req.body.enddatetime,
            prompt = req.body.prompt,
            email = req.body.email,
            result,
            isError;
        
        try {
            
            if (!application) {
                throw new Errors.ArgumentNullError('application');
            }
            
            if (!timezone) {
                throw new Errors.ArgumentNullError('timezone');
            }
            
            if (!startdatetime) {
                throw new Errors.ArgumentNullError('startdatetime');
            }
            
            if (!enddatetime) {
                throw new Errors.ArgumentNullError('enddatetime');
            }
            
            if (!prompt) {
                throw new Errors.ArgumentNullError('prompt');
            }
            
            if (!email) {
                throw new Errors.ArgumentNullError('email');
            }
            
        } catch (err) {
            logError(req,err);
            res.status(400).send(err);
            return next(err);
        }
        
        startdatetime = dateFormat(dateFormat(startdatetime, "mm/dd/yyyy hh:MM TT"), "yymmdd.hhMMss");
        enddatetime = dateFormat(dateFormat(enddatetime, "mm/dd/yyyy hh:MM TT"), "yymmdd.hhMMss");
        
        logDebug(req,'application='+application);
        logDebug(req,'timezone='+timezone);
        logDebug(req,'startdatetime='+startdatetime);
        logDebug(req,'enddatetime='+enddatetime);
        logDebug(req,'prompt='+prompt);
        logDebug(req,'email='+email);
        
        var cmd = "bor.pl proc -a " + application + 
                                " -f " + startdatetime + 
	                            " -t " + enddatetime + 
	                            " " + prompt + 
	                            " --email " + email + 
	                            " --commit";
	
        
        logInfo(req,"command='"+cmd+"'");
        
        var pl_proc = spawn('perl', [cmd]);
        var my_carrier = carrier.carry(pl_proc.stdout);

        my_carrier.on('line', function(line) {
          logInfo(req,"line='"+line+"'");
        });
        
        res.send('ok');
        
    })
    
    return api;
    
}