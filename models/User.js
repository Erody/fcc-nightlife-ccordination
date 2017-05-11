const mongoose = require('mongoose');

const User = mongoose.model('User', {
	oauthID: Number,
	name: String,
	created: Date,
	lastLocation: String,
	goingTo: [{type: mongoose.Schema.Types.ObjectId, ref:'Bar'}]
});

module.exports = User;