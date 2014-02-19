this.ps          = require('./ps');
this.https       = require('https');
this.querystring = require('querystring');

module.exports = function(host) {
		
	this.host = host;
	this.userAgent = 'powernode/0.0.0 (https://github.com/wtfaremyinitials/powernode)';
	
	// User object 
	this.User = function() {

		var username = '';
		var password = '';
		var cookie   = '';
		
		var authData = {
			'pstoken': '',
			'contextData': ''
		};	
		
		var classes = [];
		
		function isLoggedIn() {
			return session != '';
		}

		function auth(username, password) {
			this.username = username;
			this.password = password;
			this.getAuthData();
		}
		
		function getAuthData() {
			get('/public/home.html', cookie, function(body, newCookie) {
				cookie = newCookie;
				
				var pstokenRegex = /.*<input type="hidden" name="pstoken" value="(.*)" \/>.*/ // I hate regex
				var contextDataRegex = /.*<input type="hidden" name="contextData" value="(.*)" \/>.*/
				
				authData['pstoken']     = body.match(pstokenRegex)[1];
				authData['contextData'] = body.match(contextDataRegex)[1];
			});
		}
		
		function sendLoginData() {
			data = {
				'pstoken': authData['pstoken'],
				'contextData': authData['contextData'],
				'serviceName': 'PS Parent Portal', // Is this some kind of magic value? TODO
				'pcasServerUrl': '/',
				'credentialType': 'User Id and Password Credential',
				'account': username,
				'pw': psEncPw(password, authData['contextData'])
			}
			
			post('/guardian/home.html', cookie, querystring.stringify(data), function(body, newCookie) {
				
			});
		}
	
	}
	
	function get(path, cookie, callback) {
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
	
	function post(path, cookie, data, callback) {
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
	
}  

//  Password hash/encrypt thing
function psEncPw(pass, pskey) {
	return ps.hex_hmac_md5(pskey, ps.b64_md5(pass));
}

function Class() {
	
}