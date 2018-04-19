/**
 * Created by walkermellema on 10/6/17.
 */
var client = require('superagent');

client.get('https://api.bodhi-stg.io/version')
.end(function(err, res, body){
	console.log(res.body);
});