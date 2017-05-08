require('../functions/yelp').setYelpToken();
const express = require('express');
const yelp = require('yelp-fusion');
const dynamicSort = require('../functions/various').dynamicSort;
const router = express.Router();

router.post('/nearby', (req, res) => {
	const { location } = req.body;
	const client = yelp.client(process.env.YELP_ACCESS_TOKEN);
	client
		.search({
			term: 'bar',
			location: location
		})
		.then(response => {
			let result = [];
			for(let i = 0; i<10; i++) {
				let business = response.jsonBody.businesses[i];
				result.push(business)
			}
			// show it in html
			const nearbyBars = result.sort(dynamicSort('distance'));
			res.render('nearby', {nearbyBars, going: 0}); // replace 0 with actual value
		})
		.catch(err => {
			console.log(err)
		});
});

module.exports = router;