var ps = require('./ps');
var https = require('https');
var querystring = require('querystring');

var userAgent = 'powernode/0.0.0 (https://github.com/wtfaremyinitials/powernode)';

var Student = function(username, password, hostname) {
	this.username = username;
	this.password = password;
	this.hostname = hostname;
	this.cookie   = '';
};
Student.prototype.auth = function() {
	getAuthData();
}
Student.prototype.getAuthData = function() {
	get(hostname, '/public/home.html', cookie, function(body, newCookie) {
		cookie = newCookie;
		
		var pstokenRegex = /.*<input type="hidden" name="pstoken" value="(.*)" \/>.*/ // I hate regex
		var contextDataRegex = /.*<input type="hidden" name="contextData" value="(.*)" \/>.*/
		
		pstoken = body.match(pstokenRegex)[1];
		contextData = body.match(contextDataRegex)[1];
		
		sendLoginRequest(pstoken, contextData);
	});
}
Student.prototype.sendLoginRequest = function(pstoken, contextData) {
	data = {
		'pstoken': pstoken,
		'contextData': contextData,
		'serviceName': 'PS Parent Portal', // Is this some kind of magic value? TODO
		'pcasServerUrl': '/',
		'credentialType': 'User Id and Password Credential',
		'account': username,
		'pw': psEncPw(password, authData['contextData'])
	}
	
	post(hostname, '/guardian/home.html', cookie, querystring.stringify(data), function(body, newCookie) {
		cookie = newCookie;
		console.log(body);
	});
}

var Class  = function() {
	// TODO
};

function get(hostname, path, cookie, callback) {
	var options = {
		host: host,
		path: path,
		method: 'GET',
		headers: {
			'UserAgent': userAgent,
			'Cookie': (typeof cookie != 'undefined')? (cookie) : ('')
		}
	}

	https.request(options, function(res){
		var body = '';
		res.on('data', function(data){
			body += data;
		});
		res.on('end', function() {
			var cookie = res.headers['Set-Cookie'];
			if(cookie) {
				cookie = (cookie + '').split(';').shift()
			}
			
			callback(body, cookie);
		});
	}).end();
}

function post(hostname, path, cookie, data, callback) {
	var options = {
		host: host,
		path: path,
		method: 'POST',
		headers: {
			'UserAgent': userAgent,
			'Cookie': (typeof cookie != 'undefined')? (cookie) : ('')
		}
	}
	
	https.request(options, function(res){
		var body = '';
		res.on('data', function(data){
			body += data;
		});
		res.on('end', function() {
			var cookie = res.headers['Set-Cookie'];
			if(cookie) {
				cookie = (cookie + '').split(';').shift()
			}
			
			callback(body, cookie);
		});
	}).write(data).end();
}

function psEncPw(pass, pskey) {
	return ps.hex_hmac_md5(pskey, ps.b64_md5(pass));
}

module.exports.Student = Student;