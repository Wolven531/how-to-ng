const express = require('express');
const path = require('path');

const app = express();

function requireHttps(req, res, next) {
	// for Heroku
	if (!req.secure && req.get('x-forwarded-proto') !== 'https' && process.env.NODE_ENV !== 'development') {
		return res.redirect('https://'.concat(req.headers.host).concat(req.url));
	}

	next();
}

app.use(requireHttps);

app.use(express.static('./dist/how-to-ng'));

app.enable('trust proxy');

app.get('/*', function(req, res, next) {
	res.sendFile(path.join(__dirname, 'dist', 'how-to-ng', 'index.html'));
});

app.listen(process.env.PORT || 8080);
