var pscrypto = require('./pscrypto');
var Q = require('q');
var https = require('https');

var userAgent = 'powernode/0.0.1 (https://github.com/wtfaremyinitials/powernode)';

var request = Q.denodeify(https.request);

var hashPassword = function(contextData, password) {
    return pscrypto.hex_hmac_md5(contextData, pscrypto.b64_md5(password));
};

var generateDBPW = function(contextData, password) {
    return pscrypto.hex_hmac_md5(contextData, password.toLowerCase());
};

var parseIndex = function(response) {
    var body = response.body;

    var pstokenRegex = /<input type="hidden" name="pstoken" value="([a-z0-9]*)" \/>/g;
    var contextDataRegex = /<input type="hidden" name="contextData" value="([A-Z0-9]*)" \/>/g; // AKA pskey

    student.cookie = response.header['set-cookie'];
    student.authData.pstoken = body.match(pstokenRegex);
    student.authData.contextData = body.match(contextDataRegex);
};

// Perform the login request
var requestLogin = function() {
    var password = student.password;
    var contextData = student.authData.contextData;

    var hashedPassword = hashPassword(contextData, password);
    var dbpw = generateDBPW(contextData, password);

    var loginInfo = {
        pstoken: student.pstoken,
        contextData: student.contextData,
        dbpw: '', // TODO: Dafuq is the dbpw...
        translator_username: '',
        translator_password: '',
        translator_ldappassword: '',
        returnUrl: '',
        serviceName: 'PS Parent Portal', // TODO: Am I allowed to change this?
        serviceTicket: '',
        pcasServerUrl: '/',
        credentialType: 'User Id and Password Credential',
        account: student.username,
        pw: hashedPassword,
        translatorpw: '',
        Cookie: student.cookie
    };
};
