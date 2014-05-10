var Q = require('q');

module.exports = function(name, teacher) {
    this.name = name;
    this.teacher = teacher;
};

module.exports.prototype.getGrade = function(semester) {
    return Q.fcall(function() {
        
    });
};

module.exports.prototype.getAssignments = function(semester) {
    return Q.fcall(function() {

    });
};

module.exports.prototype.toString = function() {
    return '[object Student]';
};
