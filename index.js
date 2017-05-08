const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const searchRoutes = require('./routes/search');
const generalRoutes = require('./routes/general');

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

app.use('/', generalRoutes);
app.use('/search', searchRoutes);

app.listen(port, () => {
	console.log(`listening on port ${port}...`)
});

