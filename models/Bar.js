const mongoose = require('mongoose');

const Bar = mongoose.model('Bar', {
	name: String,
	phone: String,
	going: [{type: mongoose.Schema.Types.ObjectId, ref:'User'}]
});

module.exports = Bar;