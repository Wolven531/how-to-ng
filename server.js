const express = require('express');
const path = require('path');

const app = express();
const appName = 'how-to-ng';

function requireHttps(req, res, next) {
	// for Heroku
	if (!req.secure && req.get('x-forwarded-proto') !== 'https' && process.env.NODE_ENV !== 'development') {
		return res.redirect('https://'.concat(req.headers.host).concat(req.url));
	}

	next();
}

app.use(requireHttps);

app.use(express.static(path.join(__dirname, 'dist', appName)));

app.enable('trust proxy');

app.get('/*', function(req, res, next) {
	res.sendFile(path.join(__dirname, 'dist', appName, 'index.html'));
});

app.listen(process.env.PORT || 8080);
