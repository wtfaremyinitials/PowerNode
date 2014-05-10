module.exports = function(percentage, letter, maxPoints, points) {
    this.percentage = points;
    this.letter = letter;

    this.maxPoints = null;
    this.points = null;
};

module.exports.prototype.toString = function() {
    return '[object Grade]';
};
