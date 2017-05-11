require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const searchRoutes = require('./routes/search');
const generalRoutes = require('./routes/general');
const authRoutes = require('./routes/auth');
const apiRoutes = require('./routes/api');
const User = require('./models/User');

const port = process.env.PORT || 3000;

const app = express();

mongoose.connect(process.env.DB_MLAB);
mongoose.Promise = global.Promise;

app.set('view engine', 'pug');
app.set('views', __dirname + '/public/views');
app.use('/static', express.static('public'));
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());
app.use(session({
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: true,
	cookie: {}
}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
	done(null, user._id);
});
passport.deserializeUser((id, done) => {
	User.findById(id, (err, user) => {
		err ? done(err, null) : done(null, user);
	});
});

app.use('/', generalRoutes);
app.use('/search', searchRoutes);
app.use('/auth', authRoutes);
app.use('/api', apiRoutes);

app.listen(port, () => {
	console.log(`listening on port ${port}...`)
});

// todo Make this shit pretty. Important information per bar: amount going to bar, name, address, display phone in this order
// todo OPTIONAL: make detail view for every bar, showing links, rating, pictures(google api), etc.