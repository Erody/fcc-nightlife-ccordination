require('../functions/yelp').setYelpToken();
const express = require('express');
const yelp = require('yelp-fusion');
const Bar = require('../models/Bar');
const User = require('../models/User');
const dynamicSort = require('../functions/various').dynamicSort;
const stripPhoneNumber = require('../functions/various').stripPhoneNumber;
const router = express.Router();

router.get('/nearby', (req, res) => {
	if(req.user && req.user.lastLocation) {
		User
			.findOne({_id: req.user._id}, (err, user) => {
				if(!err) {
					yelpSearchAndRender(user.lastLocation, req, res);
				} else {
					console.error(err);
					res.redirect('/');
				}

			})
	} else {
		res.redirect('/changeLocation');
	}
});

router.post('/nearby', (req, res) => {
	const { location } = req.body;
	if(req.user) {
		User
			.findOne({_id: req.user._id}, (err, user) => {
				user.lastLocation = location;
				user.markModified('lastLocation');
				user.save(err => {
					if(err) console.error(err);
				});
			})
	}
	yelpSearchAndRender(location, req, res);
});

function yelpSearchAndRender(location, req, res) {
	const client = yelp.client(process.env.YELP_ACCESS_TOKEN);
	client
		.search({
			term: 'bar',
			location
		})
		.then(response => {
			let result = [];
			let x = 0;
			for(let i = 0; i<10+x; i++) {
				let business = response.jsonBody.businesses[i];
				if(business.display_phone) {
					result.push(business);
				} else {
					x++;
				}

			}
			const nearbyBars = result.sort(dynamicSort('distance'));
			const strippedPhoneNumbers = [];
			nearbyBars.forEach(bar => {
				strippedPhoneNumbers.push(stripPhoneNumber(bar.display_phone))
			});
			Bar
				.find({}, (err, bars) => {
					let going = [];
					bars.forEach(bar => {
						const index = strippedPhoneNumbers.indexOf(bar.phone);
						if(index !== -1) {
							going.push({
								index,
								going: bar.going,
							});
							// attach going amount to nearbyBars, then put render call at the end of this find()
						}
					});
					const newNearbyBars = [...nearbyBars];
					going.forEach(item => {
						const i = item.index;
						newNearbyBars[i].going = item.going.length;
					});
					res.render('nearby', {nearbyBars, authenticated: req.isAuthenticated(), user: req.user});
				});
		})
		.catch(err => {
			console.log(err)
		});
}


module.exports = router;