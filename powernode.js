// Needed modules
var https = require('https');
var querystring = require('querystring');

// Bring in PowerSchool's hack-y md5 crypto *shudder*
eval(require('fs').readFileSync('./pscrypto.js')+'');

// User agent for all requests
var userAgent = 'powernode/0.0.1 (https://github.com/wtfaremyinitials/powernode)';

// Uses PowerSchool's weird crypto to hash/encrypt the user's password
function encryptPassword(contextData, password) {
	return hex_hmac_md5(contextData, b64_md5(password));
}

function encryptDBPW(contextData, password) {
	return hex_hmac_md5(contextData, password.toLowerCase());
}

// Performs a GET request
function get(hostname, path, callback, cookie) {
	var options = {
		host: hostname,
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
			
			console.log(res.headers);
			
			return callback(body, cookie);
		});
	}).end();
} 

// Performs a POST request
function post(hostname, path, data, callback, cookie) {
	var options = {
		host: hostname,
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
			
			return callback(body, cookie);
		});
	}).end(data);
}

// Gets data needed to authenticate a new user
function getAuthData(hostname, callback) {
	get(hostname, '/public/home.html', function(body, cookie) {
		var pstokenRegex = /.*<input type="hidden" name="pstoken" value="(.*)" \/>.*/ // I hate regex
		var contextDataRegex = /.*<input type="hidden" name="contextData" value="(.*)" \/>.*/
		
		pstoken = body.match(pstokenRegex)[1];
		contextData = body.match(contextDataRegex)[1];
		
		// contextData and pskey are the same thing
		
		callback(pstoken, contextData);
	});
}

// Attempts to authenticate a user
function sendAuthData(username, password, hostname, pstoken, contextData, callback) {
	var data = {
		'pstoken': pstoken,
		'contextData': contextData,
		'dbpw': encryptDBPW(contextData, password),
		'serviceName': 'PS Parent Portal',
		'pcasServerUrl': '/',
		'credentialType': 'User Id and Password Credential',
		'account': username,
		'pw': encryptPassword(contextData, password)
	};
	
	post(hostname, '/guardian/home.html', querystring.stringify(data), function(body, cookie) {
		callback(body, cookie);
	});
}

module.exports = function(username, password, hostname) {
	getAuthData(hostname, function(pstoken, contextData) {
		sendAuthData(username, password, hostname, pstoken, contextData, function(body, cookie) {
		});
	});
} 