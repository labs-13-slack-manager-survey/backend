const Sentry = require('@sentry/node');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');


//interprets requests sent from Slack to our endpoints
const rawBodyBuffer = (req, res, buf, encoding) => {
	if (buf && buf.length) {
		req.rawBody = buf.toString(encoding || 'utf8');
	}
};

module.exports = server => {
	server.use(Sentry.Handlers.requestHandler()); // needs to be before all request
	server.use(cors());
	server.use(bodyParser.json());
	server.use(bodyParser.urlencoded({ verify: rawBodyBuffer, extended: true }));
	server.use(helmet());
	server.use(morgan('dev'));
};
