var Q = require('q');

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

    return requestIndex().then(parseIndex).then(requestLogin).then(checkSuccess).then(function() {
        return this;
    });
};

module.exports.prototype.getClasses = function() {
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