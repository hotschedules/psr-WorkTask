
/**
 * Created by walkermellema on 11/13/17.
 */
/**
 * Created by walkermellema on 11/9/17.
 */
var floodLogin = 'https://flood.io/app/p';

var floodUser = process.env.FLOODUSER;
var floodPass = process.env.FLOODPASS;

var bearerToken;
var submitURL;

var client = require('superagent');
var url = 'https://api.flood.io';
var patchURL = 'https://flood.io/api/v3/floods/';

var fs = require('fs');

var contents = fs.readFileSync('FloodResponse.txt', 'utf8');
var floodJSON = JSON.parse(contents);
var floodUUID = floodJSON.uuid;
var permalink = floodJSON.permalink;

var agent = client.agent();
agent.get(floodLogin)
	.end(function (err, res) {
		if(err){
			console.log(err);
		}
		else{
			submitURL = 'https://flood.io/oauth/token';
			agent.post(submitURL)
				.type('form')
				.send({'username': floodUser})
				.send({'password': floodPass})
				.send({'grant_type': 'password'})
				.set({'Accept': '*/*'})
				.set({'Accept-Encoding': 'gzip, deflate, br'})
				.set({'Accept-Language': 'en-US,en;q=0.8'})
				.set({'Connection': 'keep-alive'})
				.set({'content-type': 'application/x-www-form-urlencoded'})
				.set({'Host': 'flood.io'})
				.set({'Origin': 'https://flood.io'})
				.set({'Referer': 'https://flood.io/app/login'})
				.set('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36')
				.end(function (err, res) {
					if(err){
						console.log(err);
					}
					else{
						bearerToken = res.body.access_token;
						client.patch(patchURL + floodUUID + '/set-public')
							.set('Accept', 'application/vnd.api+json')
							.set('Authorization', 'Bearer ' + bearerToken)
							.end(function(err, res){
								if(err){
									console.log(err);
								}
								else{
									console.log('***Permalink Enabled***');
								}
							});
					}

				});
		}
	});

var counter = 0;
var started = false;

var checkUUID = function(){
	client.get(url + '/floods/' + floodUUID)
		.auth(process.env.FLOOD)
		.end(function(err, res, body){
			if(err){
				if(res.statusCode !== 504){
					console.log(err);
					clearInterval(interval);
				}
			}
			else {
				if(res.body.status === 'running'){
					if(!started){
						started = true;
						console.log('*******************************************TEST HAS STARTED');
						console.log('View load test progress here:', permalink);
						console.log('*******************************************WAITING FOR TEST TO FINISH');
					}
				}
				if (res.body.status === 'finished') {
					counter++;
					if(counter === 1) {
						clearInterval(interval);
						client.get(url + '/floods/' + floodUUID + '/report')
							.auth(process.env.FLOOD)
							.end(function (err, res) {
								if (err) {
									console.log(err);
									clearInterval(interval);
								}
								else {
									console.log('REPORT********************************************************REPORT');
									console.log(res.body.summary);
									console.log('Mean Response Time:', res.body.mean_response_time, 'ms');
									console.log('Mean Error Rate:', res.body.mean_error_rate, 'requests / min');
									console.log('FLOOD:', floodJSON);
								}
							});
					}
					if (res.body.status === 'stopped') {
						clearInterval(interval);
						console.log('PSR test stopped prematurely.')
					}
				}
			}
		});
};

var interval = setInterval(checkUUID, 60000);