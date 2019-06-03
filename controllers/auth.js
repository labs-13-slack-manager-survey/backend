const router = require('express').Router();
const Users = require('../models/Users');
const moment = require('moment');
const axios = require('axios');
const qs = require('qs');
const { generateToken } = require('../helpers/generateToken');
const admin = require('firebase-admin');
const authenticate = require('../middleware/authenticate');

// Firebase config - to be extracted out to another file.

const config = {
	type: 'service_account',
	project_id: process.env.PROJECT_ID,
	private_key_id: process.env.PRIVATE_KEY_ID,
	private_key: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
	client_email: process.env.CLIENT_EMAIL,
	client_id: process.env.CLIENT_ID,
	auth_uri: 'https://accounts.google.com/o/oauth2/auth',
	token_uri: 'https://oauth2.googleapis.com/token',
	auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
	client_x509_cert_url: process.env.CLIENT_URL
};

admin.initializeApp({ credential: admin.credential.cert(config) });


router.post('/firebase', async ({ body }, res) => {
	// deconstruct access token
	const { accessToken } = body.user.stsTokenManager;
	try {
		// verify access token with Firebase admin.
		const {
			email,
			name: fullName,
			picture: profilePic
		} = await admin.auth().verifyIdToken(accessToken);
		// desconstructed variables form the userObj to be inserted into Users Model
		const userObj = {
			teamId: null,
			email,
			password: null,
			fullName,
			roles: 'member',
			profilePic,
			created_at: moment().format(),
			timezone: body.timezone,
			joinCode: null
		};

		// First we check if the email belongs to an exisitng user
		const [existingUser] = await Users.findBy({ email });
		// If true we generate a token and return it back to the client
		if (existingUser) {
			const token = generateToken(existingUser);
			res.status(201).json(token);
			// If false we add the userObj to the User Model, generate a token and return it back to the client
		} else {
			const newUser = await Users.add(userObj);
			const token = generateToken(newUser);
			res.status(201).json(token);
		}
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: 'Error authenticating user' });

		throw new Error(error);
	}
});

router.get('/slack/', authenticate, async (req, res, next) => {
	const { subject, roles, teamId } = req.decodedJwt;
	const payload = qs.stringify({
		client_id: process.env.SLACK_CLIENT_ID,
		client_secret: process.env.SLACK_CLIENT_SECRET,
		code: req.query.code,
		redirect_uri: process.env.SLACK_REDIRECT_URI
	});
	const headers = {
		'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
	};
	try {
		// Make Auth request with Slack
		const { data } = await axios.post(
			'https://slack.com/api/oauth.access',
			payload,
			headers
		);
		if (data.ok === false || data.user_id === null) {
			return res.status(401).json({ message: 'Slack authentication error' });
		}
		// Check slackToken has not already been assigned to previous user
		const user = await Users.findBy({ slackToken: data.access_token });
		if (user.length > 0) {
			return res.status(400).json({ message: 'Browser associated with another user, clear cookies' });
		}
		// Query the users table for User resource
		const resource = await Users.findById(subject);
		// If resource slackToken === null, then build slackObj to update the user resource
		const slackObj = {
			slackToken: data.access_token,
			slackUserId: data.user_id,
			slackTeamId: data.team_id
		};
		if (resource.slackToken === null) {
			await Users.update(subject, slackObj);
			const user = { subject, roles, teamId, ...slackObj };
			const token = generateToken(user);
			return res.status(202).json({ token });
		} else {
			// If resource slackToken !== null, then create token Obj
			const user = { subject, roles, teamId, ...slackObj };
			const token = generateToken(user);
			return res.status(202).json({ token });
		}
	} catch (err) {
		console.log(err);
		res.status(500).json({ message: 'Error authenticating user' });
		throw new Error(err);
	}
});

module.exports = router;
