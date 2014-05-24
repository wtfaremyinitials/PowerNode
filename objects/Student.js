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
};

module.exports.prototype.authenticate = function(hostname, username, password) {
    this.hostname = hostname;
    this.username = username;
    this.password = password;

    return util.requestIndex()
            .then(util.parseIndex)
            .then(util.requestLogin)
            .then(util.checkSuccess)
            .then(function() { return this; })
            .catch(function() {
                // TODO: Handle errors somewhat gracefully
            });
};

module.exports.prototype.getCourses = function() {
    return util.getCourses(this.hostname, this.cookie);
};

module.exports.prototype.getGrades = function(course, semester) {
    return util.getGrades(this.hostname, this.cookie, course, semester);
};

module.exports.prototype.toString = function() {
    return '[object Student]';
};
