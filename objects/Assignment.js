module.exports = function(name, grade, status, comment, teacher) {
    this.name = name;
    this.grade = grade;
    this.sttaus = status;
    this.comment = comment;
    this.teacher = teacher;
};

module.exports.prototype.toString = function() {
    return '[object Assignment]';
};
