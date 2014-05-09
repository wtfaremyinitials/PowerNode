var pscrypto = require('../lib/pscrypto');

var testPassword = 'testPassword';
var testContextData = '552D5F99692404B640926F044B681B8B040657F6501B322B42255E9C0DC7779F';

exports['Test password hashing'] = function(test) {
    var result = pscrypto.hex_hmac_md5(testContextData, pscrypto.b64_md5(testPassword));

    test.equal(result, 'b54b408791356ee7eaf4baa32bd347bd');
    test.done();
};

exports['Test dbpw generation'] = function(test) {
    var result = pscrypto.hex_hmac_md5(testContextData, testPassword.toLowerCase());

    test.equal(result, 'e905832b5ca5854d94ffb244e76f3691');
    test.done();
};
