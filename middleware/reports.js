module.exports = {
	adminValidation
};

function adminValidation(req, res, next) {
	const { teamId, roles } = req.decodedJwt;

	if (!teamId) {
		return res
			.status(401)
			.json({ message: 'User is not assigned to a team.' });
	}

	if (roles !== 'admin') {
		return res
			.status(401)
			.json({
				message: 'User is not an admin for this team.'
			});
	}

	next();
}
