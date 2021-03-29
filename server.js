const express = require('express');
const path = require('path');

const appName = 'how-to-ng';
const distDir = 'dist';
const serverEnvironment = process.env.NODE_ENV !== 'development';
const serverPort = process.env.PORT || 8080;

const app = express();

app.use(requireHttps);

app.use(express.static(path.join(__dirname, distDir, appName)));

app.enable('trust proxy');

app.get('/*', function(req, res, next) {
	res.sendFile(path.join(__dirname, distDir, appName, 'index.html'));
});

app.listen(serverPort);

function requireHttps(req, res, next) {
	// for Heroku
	if (!req.secure && req.get('x-forwarded-proto') !== 'https' && serverEnvironment) {
		return res.redirect('https://'.concat(req.headers.host).concat(req.url));
	}

	next();
}
