module.exports = function(name, email) {
    this.name = name;
    this.email = email;
};

module.exports.prototype.toString = function() {
    return '[object Teacher]';
};
