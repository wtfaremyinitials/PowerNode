var pscrypto = require('../lib/pscrypto');

var correctPassword   = 'testPassword';
var incorrectPassword = 'NopeNotThePW';
var testContextData = '552D5F99692404B640926F044B681B8B040657F6501B322B42255E9C0DC7779F';

exports['Test password hashing'] = function(test) {
    var correctResult   = pscrypto.hex_hmac_md5(testContextData, pscrypto.b64_md5(correctPassword));
    var incorrectResult = pscrypto.hex_hmac_md5(testContextData, pscrypto.b64_md5(incorrectPassword));

    test.equal(correctResult, 'b54b408791356ee7eaf4baa32bd347bd');
    test.notEqual(incorrectResult, 'b54b408791356ee7eaf4baa32bd347bd');
    test.done();
};

exports['Test dbpw generation'] = function(test) {
    var correctResult   = pscrypto.hex_hmac_md5(testContextData, correctPassword.toLowerCase());
    var incorrectResult = pscrypto.hex_hmac_md5(testContextData, incorrectPassword.toLowerCase());

    test.equal(correctResult, 'e905832b5ca5854d94ffb244e76f3691');
    test.notEqual(incorrectResult, 'e905832b5ca5854d94ffb244e76f3691');
    test.done();
};
