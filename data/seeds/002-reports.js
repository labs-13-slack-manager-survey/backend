const moment = require('moment');

exports.seed = function(knex) {
	return knex('reports').insert([
		{
			teamId: 1,
			reportName: 'Daily Standup',
			created_at: moment().format(),
			schedule: JSON.stringify([
				'Monday',
				'Tuesday',
				'Wednesday',
				'Thursday',
				'Friday',
				'Saturday',
				'Sunday'
			]),
			scheduleTime: '14:00',
			message: 'Please fill out the report',
			questions: JSON.stringify([
				'How do you feel today?',
				'What did you get done today?',
				'Did you finish your goals for today?',
				'What will you work on tomorrow?'
			]),
			slackChannelName: null,
			slackChannelId: null,
			active: true
		},
		{
			teamId: 2,
			reportName: 'Daily Standup',
			created_at: moment().format(),
			schedule: JSON.stringify([
				'Monday',
				'Tuesday',
				'Wednesday',
				'Thursday',
				'Friday',
				'Saturday',
				'Sunday'
			]),
			scheduleTime: '15:00',
			message: 'Please fill out the report',
			questions: JSON.stringify([
				'How do you feel today?',
				'What did you get done today?',
				'Did you finish your goals for today?',
				'What will you work on tomorrow?'
			]),
			slackChannelName: null,
			slackChannelId: null,
			active: true
		},
		{
			teamId: 3,
			reportName: 'Daily Standup',
			created_at: moment().format(),
			schedule: JSON.stringify([
				'Monday',
				'Tuesday',
				'Wednesday',
				'Thursday',
				'Friday',
				'Saturday',
				'Sunday'
			]),
			scheduleTime: '16:00',
			message: 'Please fill out the report',
			questions: JSON.stringify([
				'How do you feel today?',
				'What did you get done today?',
				'Did you finish your goals for today?',
				'What will you work on tomorrow?'
			]),
			slackChannelName: null,
			slackChannelId: null,
			active: true
		},
		{
			teamId: 4,
			reportName: 'Daily Standup',
			created_at: moment().format(),
			schedule: JSON.stringify([
				'Monday',
				'Tuesday',
				'Wednesday',
				'Thursday',
				'Friday',
				'Saturday',
				'Sunday'
			]),
			scheduleTime: '17:00',
			message: 'Please fill out the report',
			questions: JSON.stringify([
				'How do you feel today?',
				'What did you get done today?',
				'Did you finish your goals for today?',
				'What will you work on tomorrow?'
			]),
			slackChannelName: null,
			slackChannelId: null,
			active: true
		},
		{
			teamId: 5,
			reportName: 'Daily Standup',
			created_at: moment().format(),
			schedule: JSON.stringify([
				'Monday',
				'Tuesday',
				'Wednesday',
				'Thursday',
				'Friday',
				'Saturday',
				'Sunday'
			]),
			scheduleTime: '18:00',
			message: 'Please fill out the report',
			questions: JSON.stringify([
				'How do you feel today?',
				'What did you get done today?',
				'Did you finish your goals for today?',
				'What will you work on tomorrow?'
			]),
			slackChannelName: null,
			slackChannelId: null,
			active: true
		}
	]);
};
