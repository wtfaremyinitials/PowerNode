/*
	Packages
 */
var Q     = require('q');
var https = require('https');

/* 
	Variables
*/

// User Agent sent to PowerSchool server
var userAgent = 'powernode/0.0.1 (https://github.com/wtfaremyinitials/powernode)';

/*
	Util Methods
*/

// Performs an HTTPS POST request
var post = function(hostname, path, cookie, data) {
	return Q.fcall(function(hostname, path, cookie, data) {
		var options = {
			host: hostname,
			path: path,
			method: 'POST',
			headers: {
				'UserAgent': userAgent,
				'Cookie': (cookie || '')
			}
		}

		https.request(options, function(res){
			var body = '';
			
			res.on('data', function(data){
				body += data;
			});
			
			res.on('end', function() {
				return {
					"body": body,
					"cookie": (res.headers['Set-Cookie'] || '')
				}
			});
			
		}).end(data); 
	});
}

var get = function(hostname, path, cookie) {
	return Q.fcall(function(hostname, path, cookie) {
		var options = {
			host: hostname,
			path: path,
			method: 'GET',
			headers: {
				'UserAgent': userAgent,
				'Cookie': (cookie || '')
			}
		}

		https.request(options, function(res){
			var body = '';
			
			res.on('data', function(data){
				body += data;
			});
			
			res.on('end', function() {
				return {
					"body": body,
					"cookie": res.headers['Set-Cookie']
				}
			});
			
		}); 
	});
}

/*
	Models
*/
var Student = {};
Student.prototype.getClasses();
Student.prototype.getGrades(class);
Student


/*
	Functions
*/

var getAuthenticationData = function() {
	
}


var loginStudent = function(hostname, username, password) {
	return Q.fcall(function() {
		
		
		
		
	});
}

module.exports.loginStudent = loginStudent;
