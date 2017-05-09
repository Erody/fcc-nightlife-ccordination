const express = require('express');
const router = express.Router();
const passport = require('passport');
const GithubStrategy = require('passport-github2').Strategy;
require('../pass')(passport, GithubStrategy);

router.get('/', (req, res) => {
	res.send('Auth ');
});

router.get('/login', (req, res) => {
	res.render('login');
});

router.get('/logout', (req, res) => {
	req.session.destroy(err => {
		err ? console.log(err) : res.redirect('/');
	})
});

router.get('/github', passport.authenticate('github'), (req, res) => {});

router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/login'}), (req, res) => {
	res.redirect(req.session.returnTo || '/');
	req.session.returnTo = null;
});

module.exports = router;