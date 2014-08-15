var subprocess = require('child_process');
var Q = require('q');

var binPath    = __dirname + '/node_modules/casperjs/bin/casperjs'
var scriptPath = __dirname + '/getdata.js';

var packagejson = JSON.parse(require('fs').readFileSync('package.json'));
var userAgent = 'powernode/' + packagejson.version + ' (' + packagejson.repository + ')';

var getStudentData = function(hostname, username, password, cb) {
    var deferred = Q.defer();
    subprocess.execFile(binPath, [scriptPath, hostname, username, password], function(err, stdout, stderr) {
        if(stdout == 'BADPASS')
            deferred.reject('BADPASS');
        if((stdout+'').indexOf('CasperError') != -1)
            deferred.reject('INTERNAL');
        if(stdout == '')
            deferred.reject('UNKNOWN');
        deferred.resolve(stdout);
    });
    return deferred.promise.nodeify(cb);
};

var setUserAgent = function(newAgent) {
    userAgent = 'powernode/' + packagejson.version + ' (' + packagejson.repository + ') on application ' + newAgent;
};

module.exports.getStudentData = getStudentData;
module.exports.setUserAgent   = setUserAgent;
