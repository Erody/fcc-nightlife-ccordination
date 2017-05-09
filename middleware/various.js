exports.isAuthenticated = function(req, res, next) {
	if(req.isAuthenticated()){
		res.locals.user = req.user;
		next();
	} else {
		req.session.returnTo = req.originalUrl;
		res.redirect('/auth/login')
	}
};