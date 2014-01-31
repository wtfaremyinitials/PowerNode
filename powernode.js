module.exports = function(host) {
	
	this.http = require('http');
	
	this.host = host;
	this.userAgent = 'powernode/0.0.0 (https://github.com/wtfaremyinitials/powernode)';
	
	// User object 
	this.User = function() {

		var username = '';
		var password = '';
		var session  = '';	
		
		var classes = [];

		function isLoggedIn() {
			return session != '';
		}

		function auth(username, password) {
			this.username = username;
			this.password = password;
			this.getCSRFToken();
		}
		
		function getCSRFToken() {
			http.request({
				hostname: host,
				port: 80,
				path: '/public/home.html',
				method: 'GET',
				headers: {
					'UserAgent': userAgent
				}
			}, function(res) {
				if(res.statusCode != 200) {
					// Uh, oh
				} else {
					var chunks = [];
					res.on('data', function(data){
						chunks.push(data);
					});
					res.on('end', function(){
						var body = new Buffer(chunks.length);
						var copied = 0;
						chunks.forEach(function(chunk) {
							chunk.copy(body, copied, 0);
							copied += chunk.length;
						});
						// Now, to find the token. I feel like I'm falling deeper into the rabbit hole
					});
				}
			}).on('error', function(e) {
				// Uh, oh
			});
		}
		
		function sendLoginData() {
			http.request({
				
			}, loginComplete);
		}
		
		function loginComplete() {
			
		}
	
	}
	
}  

function Class() {
	
}