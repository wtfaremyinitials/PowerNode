var Q = require('q');
var util = require('../lib/util.js');

module.exports = function() {
    this.hostname = '';
    this.usernane = '';
    this.password = '';
    this.cookie = '';

    this.authData = {
        pstoken: '',
        contextData: ''
    };

    this.semester = [

    ];
};

module.exports.prototype.authenticate = function(hostname, username, password) {
    this.hostname = hostname;
    this.username = username;
    this.password = password;

    return util.requestIndex()
            .then(util.parseIndex)
            .then(util.requestLogin)
            .then(util.checkSuccess)
            .then(function() { return this; });
};

module.exports.prototype.getCourses = function() {
    return Q.fcall(function() {

    });
};

module.exports.prototype.getGrades = function() {
    return Q.fcall(function() {

    });
};

module.exports.prototype.toString = function() {
    return '[object Student]';
};
