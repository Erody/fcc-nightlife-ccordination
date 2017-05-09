require('dotenv').config();
const User = require('./models/User');

module.exports = function(passport, GithubStrategy){
	passport.use(new GithubStrategy({
			clientID: process.env.GITHUB_CLIENT_ID,
			clientSecret: process.env.GITHUB_CLIENT_SECRET,
			callbackURL: process.env.GITHUB_CALLBACKURL
		},
		function(accessToken, refreshToken, profile, done) {
			User.findOne({ oauthID: profile.id }, (err, user) => {
				if(err) {
					console.log(err);  // handle errors!
				}
				if (!err && user !== null) {
					done(null, user);
				} else {
					const newUser = new User({
						oauthID: profile.id,
						name: profile.displayName,
						created: Date.now()
					});
					newUser.save((err) => {
						if(err) {
							console.log(err);  // handle errors!
						} else {
							console.log("saving user ...");
							done(null, newUser);
						}
					});
				}
			});
		}
	));
};