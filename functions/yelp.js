require('dotenv').config();
const yelp = require('yelp-fusion');

const clientId = process.env.YELP_CLIENT_ID;
const clientSecret = process.env.YELP_CLIENT_SECRET;

exports.setYelpToken = function () {
	yelp.accessToken(clientId, clientSecret).then(response => {
		process.env['YELP_ACCESS_TOKEN'] = response.jsonBody.access_token;
	}).catch(err => {
		console.log(err)
	});
};