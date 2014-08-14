var subprocess = require('child_process');
var Q = require('q');

var binPath    = __dirname + '/node_modules/casperjs/bin/casperjs'
var scriptPath = __dirname + '/getdata.js';

var getStudentData = function(hostname, username, password) {
    var deferred = Q.defer();
    subprocess.execFile(binPath, [scriptPath, hostname, username, password], function(err, stdout, stderr) {
        var result;
        try
            result = JSON.parse(stdout);
        catch(e)
            deferred.reject(e);
        if(result.error)
            deferred.reject(result);
        deferred.resolve(result);
    });
    return deferred;
};

module.exports.getStudentData = getStudentData;
