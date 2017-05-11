const express = require('express');
const Bar = require('../models/Bar');
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
				const index = bar.going.indexOf(user._id);
				if(index === -1) {
					bar.going.push(user._id);
					bar.save((err) => {
						if(err) {
							console.error(err);
						}
					});
				} else {
					bar.going.splice(index, 1);
					bar.save((err) => {
						if(err) {
							console.error(err);
						}
					});
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
						console.error(err);
					}
				});
			}
		});

	console.log('/bars/indicateGoing hit');
	console.log(data);
	res.json({success: true})
});

module.exports = router;