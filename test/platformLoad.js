/**
 * Created by walkermellema on 10/6/17.
 */
var client = require('superagent');
var url = 'https://api.flood.io';
var patchURL = 'https://flood.io/api/v3/floods/';

var fs = require('fs');

var contents = fs.readFileSync('FloodResponse.txt', 'utf8');
var floodJSON = JSON.parse(contents);
var floodUUID = floodJSON.uuid;
var permalink = floodJSON.permalink;

//curl -X PATCH "https://flood.io/api/v3/floods/LBMiCAUNB13jNhWBApoJfg/set-public" -H "Accept:application/vnd.api+json" -H "Authorization:Bearer af17289d712a7cb6fb31194370a8325399513f1afa3b6abddf73f36a600d30db"


client.patch(patchURL + floodUUID + '/set-public')
	.set('Accept', 'application/vnd.api+json')
	.set('Authorization', 'Bearer af17289d712a7cb6fb31194370a8325399513f1afa3b6abddf73f36a600d30db')
	.end(function(err, res){
		if(err){
			console.log(err);
		}
		else{
			console.log('***Permalink Enabled***');
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


