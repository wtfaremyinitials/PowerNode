var casper = require('casper').create();

var hostname = casper.cli.args[0];
var username = casper.cli.args[1];
var password = casper.cli.args[2];

var baseURL = 'https://' + hostname;

var fillForm = function() {
    this.fill('form[name="LoginForm"]', {
        account: username,
        pw: password
    }, true);
};

var checkSuccess = function() {
    this.evaluateOrDie(function() {
        return /Grades and Attendance/.test(document.body.innerText)
    });
};

var dumpPageContent = function() {
    this.download(baseURL + '/guardian/studentdata.xml', '/dev/stdout');
};

casper.start(baseURL + '/public/', fillForm);
casper.then(checkSuccess);
casper.then(dumpPageContent);

casper.run()
