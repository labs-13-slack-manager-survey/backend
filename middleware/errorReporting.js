/*

*/
const Sentry = require('@sentry/node');

module.exports = server => {
	server.use(Sentry.Handlers.errorHandler());
};
