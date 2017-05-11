const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
	if(req.user) {
		res.redirect('/search/nearby');
	} else {
		res.render('home', {authenticated: req.isAuthenticated()});
	}
});

router.get('/changeLocation', (req, res) => {
	res.render('home', {authenticated: req.isAuthenticated()});
});

module.exports = router;