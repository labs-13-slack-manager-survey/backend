const router = require('express').Router();
const Reports = require('../models/Reports');
const { adminValidation } = require('../middleware/reports');

// This route will return all reports by Team ID
router.get('/', async (req, res) => {
	const { teamId } = req.decodedJwt;
	try {
		const reports = await Reports.findByTeam(teamId);
		if (reports.length === 0) {
			let message = 'No reports by that team were found in the database';
			res.status(200).json({ message, reports });
		} else {
			let message = 'The reports were found in the database.';
			res.status(200).json({ message, reports });
		}
	} catch (error) {
		res.status(500).json({
			message:
				'Sorry but something went wrong while retrieving the list of reports'
		});

		//sentry call
		throw new Error(error);
	}
});

// This route will only return the reportId in the request parameters
// if the resource teamId matches the token teamId
router.get('/:reportId', async (req, res) => {
	const { reportId } = req.params;
	const { teamId } = req.decodedJwt;
	try {
		const report = await Reports.findByIdAndTeamId(reportId, teamId);
		if (report) {
			const message = 'The reports were found in the database.';
			res.status(200).json({
				message,
				report: {
					...report,
					questions: JSON.parse(report.questions),
					schedule: JSON.parse(report.schedule)
				}
			});
		} else {
			let message = 'No report was found in the database';
			res.status(404).json({ message });
		}
	} catch (error) {
		res.status(500).json({
			message:
				'Sorry but something went wrong while retrieving the list of reports'
		});

		//sentry call
		throw new Error(error);
	}
});

// Add a report
router.post('/', adminValidation, async (req, res) => {
	//destructuring teamId from decoded token
	const { teamId } = req.decodedJwt;

	const newReport = { ...req.body, teamId };

	try {
		const report = await Reports.add(newReport);
		const reports = await Reports.findByTeam(teamId);
		res.status(201).json(reports);
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: 'Sorry, something went wrong while adding the report'
		});

		//sentry call
		throw new Error(error);
	}
});

router.delete('/:id', adminValidation, async (req, res) => {
	const { teamId } = req.decodedJwt;
	try {
		const { id } = req.params;
		const count = await Reports.remove(id);
		if (count === 0) {
			const message = "This report doesn't exist.";
			res.status(404).json({ message });
		} else {
			const reports = await Reports.findByTeam(teamId);
			const message = 'The report was successfully deleted.';
			res.status(202).json({ message, reports });
		}
	} catch (error) {
		res.status(500).json({
			message: 'Sorry, something went wrong while deleting the report'
		});

		//sentry call
		throw new Error(error);
	}
});

//edit later to pull out specific edit fields from the req.body
router.put('/:reportId', adminValidation, async (req, res) => {
	const { teamId } = req.decodedJwt;
	try {
		const { reportId } = req.params;
		const editedReport = await Reports.update(reportId, teamId, req.body);
		if (editedReport) {
			const reports = await Reports.findByTeam(teamId);
			res.status(201).json(reports);
		} else {
			res.status(404).json({
				message: 'The report is not found'
			});
		}
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: 'Sorry, something went wrong while updating the report'
		});
		//sentry call
		throw new Error(error);
	}
});

module.exports = router;
