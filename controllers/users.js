const router = require('express').Router();
const Users = require('../models/Users');
const { generateToken } = require('../helpers/generateToken');
const { adminValidation } = require('../middleware/reports');

// Get all users
router.get('/', async (req, res) => {
	try {
		const users = await Users.find();
		const message = 'The users were found in the database.';
		res.status(200).json({ message, users });
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message:
				'Sorry but something went wrong while retrieving the list of users'
		});

		throw new Error(error);
	}
});

// Get user by id
router.get('/byuser', async (req, res) => {
	try {
		const id = req.decodedJwt.subject;
		const user = await Users.findById(id);

		if (user) {
			res.status(200).json({
				message: 'The user was retrieved successfully',
				user
			});
		} else {
			res.status(404).json({
				message: 'Sorry, the user requested does not exist'
			});
		}
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: 'Sorry but something went wrong while retrieving the user.'
		});

		throw new Error(error);
	}
});

// Get all users for a team by teamId
router.get('/team', async (req, res) => {
	const { teamId } = req.decodedJwt;
	try {
		const users = await Users.findByTeam(teamId);

		res.status(200).json({
			message: `The users for team ${teamId} were found successfully.`,
			users
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message:
				'Sorry but something went wrong while retrieving the users for this team.'
		});

		throw new Error(error);
	}
});

// Get teamId by joinCode and update member's teamId to reflect admin's
router.get('/joinCode/:joinCode', async (req, res) => {
	const id = req.decodedJwt.subject;
	const { joinCode } = req.params;

	try {
		const teamId = await Users.findByJoinCode(joinCode);
		const updated = await Users.updateTeamId(id, { teamId, joinCode });
		const updatedToken = generateToken(updated);
		res.status(202).json({
			message: 'The user has successfully joined their team.',
			updatedToken
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message:
				'Sorry but something went wrong while retrieving the team id for this user.'
		});
		throw new Error(error);
	}
});

//edit user by ID
//what properties do we want to be editable?
// need to validate user exists
router.put('/', async (req, res) => {
	try {
		const id = req.decodedJwt.subject;

		const editedUser = await Users.update(id, req.body);
		const token = await generateToken(editedUser);

		res.status(200).json({
			message: 'The user was edited succesfully.',
			editedUser,
			token
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: 'Sorry, there was an error when updating the user.'
		});
		throw new Error(error);
	}
});

//delete user by ID. Not actually sure we'll need this as we may just switch Active to false.
router.delete('/', async (req, res) => {
	try {
		const id = req.decodedJwt.subject;
		const user = await Users.findById(id);
		if (user) {
			await Users.remove(id);

			res.status(200).json({
				message: 'The user has been successfully removed.'
			});
		} else {
			res.status(404).json({
				message: 'Sorry, that user does not exist.'
			});
		}
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: 'Sorry, there was an error deleting the user.'
		});

		throw new Error(error);
	}
});

// This is for managers to inactivate the user account of team members when they leave
router.put('/:userId', adminValidation, async (req, res) => {
	try {
		const { userId } = req.params;
		const editedUser = await Users.update(userId, req.body);
		const token = await generateToken(editedUser);

		res.status(200).json({
			message: 'The user was editied successfully',
			editedUser,
			token
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: 'Sorry, there was an error when updating the user.'
		});
		throw new Error(error);
	}
});

module.exports = router;
