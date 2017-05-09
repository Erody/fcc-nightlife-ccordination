const express = require('express');
const Bar = require('../models/Bar');
const User = require('../models/User');
const router = express.Router();

router.post('/bars/indicateGoing', (req, res) => {
	const data = req.body;
	const {phone, name, user} = data;

	// Add user who clicked the button to the bar, increment the going count of that bar by 1
	Bar
		.findOne({phone}, (err, bar) => {
			if(err) {
				console.error(err);
			}
			if(!err && bar !== null ) {
				if(bar.going.indexOf(user._id) === -1) {
					bar.going.push(user._id);
					bar.save((err) => {
						if(err) {
							console.error(err);
						} else {
							console.log('adding user to bar...');
						}
					});
				} else {
					console.log('user is already going to this bar');
				}

			} else {
				const newBar = new Bar({
					name,
					phone,
					going: []
				});
				newBar.going.push(user._id);
				newBar.save((err) => {
					if(err) {
						console.error(err);  // handle errors!
					} else {
						console.log("saving bar ...");
					}
				});
			}
		});

	console.log('/bars/indicateGoing hit');
	console.log(data);
	res.json({success: true})
});

module.exports = router;