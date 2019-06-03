const router = require('express').Router();
const sgMail = require('@sendgrid/mail');


sgMail.setApiKey(
	process.env.SENDGRID_API_KEY
);

router.post('/', async (req, res) => {
	try {
		const { email, joinCode } = req.body;
		const msg = {
			to: email,
			from: 'stand-em-up@lambdaschool.gov',
			subject: 'Welcome to Stand-Em-Up',
			text: `Join our Stand-Em-Up team. Go to https://stand-em-ups.netlify.com/login, create a login, and enter your join code (${joinCode}) when prompted.`
		};
		const success = await sgMail.send(msg);
		res.status(200).end();
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: 'Sorry but something went wrong while sending the emails.'
		});
		throw new Error(error);
	}
});

module.exports = router;


