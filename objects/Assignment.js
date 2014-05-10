module.exports = function() {
    this.name = '';
    this.grade = {};
    this.teacher = {};
    this.student = {};
};

module.exports.prototype.toString = function() {
    return '[object Assignment]';
};
