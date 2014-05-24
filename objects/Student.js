var Q = require('q');
var xml2js = require('xml2js');
var util = require('../lib/util.js');

var parseString = function(xmlData) {
    var deferred = Q.defer();
    xml2js.parseString(xmlData, deferred.resolve);
    return deferred.promise;
};

module.exports = function() {
    this.hostname = '';
    this.usernane = '';
    this.password = '';
    this.cookie   = '';

    this.authData = {
        pstoken: '',
        contextData: ''
    };

    this.courses = [];
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

module.exports.prototype.update = function() {
    return util.get('/guardian/studentdata.xml', this.cookie).then(parseXML).then(deferred.resolve);
};

module.expots.prototype.updateObject = function() {

};

module.exports.prototype.toString = function() {
    return '[object Student]';
};
