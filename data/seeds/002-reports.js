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
			recurring: '1week',
			message: 'Please fill out the report',
			responseTimeLimit: moment().format(),
			questions: JSON.stringify([
				'How do you feel today?',
				'What did you get done today?',
				'Did you finish your goals for today?',
				'What will you work on tomorrow?'
			]),
			slackChannelName: null,
			slackChannelId: null,
			nextPublishDate: '2019-05-09 14:00:00',
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
			recurring: '1week',
			message: 'Please fill out the report',
			responseTimeLimit: moment().format(),
			questions: JSON.stringify([
				'How do you feel today?',
				'What did you get done today?',
				'Did you finish your goals for today?',
				'What will you work on tomorrow?'
			]),
			slackChannelName: null,
			slackChannelId: null,
			nextPublishDate: '2019-05-09 15:00:00',
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
			recurring: '1week',
			message: 'Please fill out the report',
			responseTimeLimit: moment().format(),
			questions: JSON.stringify([
				'How do you feel today?',
				'What did you get done today?',
				'Did you finish your goals for today?',
				'What will you work on tomorrow?'
			]),
			slackChannelName: null,
			slackChannelId: null,
			nextPublishDate: '2019-05-09 16:00:00',
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
			recurring: '1week',
			message: 'Please fill out the report',
			responseTimeLimit: moment().format(),
			questions: JSON.stringify([
				'How do you feel today?',
				'What did you get done today?',
				'Did you finish your goals for today?',
				'What will you work on tomorrow?'
			]),
			slackChannelName: null,
			slackChannelId: null,
			nextPublishDate: '2019-05-09 17:00:00',
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
			recurring: '1week',
			message: 'Please fill out the report',
			responseTimeLimit: moment().format(),
			questions: JSON.stringify([
				'How do you feel today?',
				'What did you get done today?',
				'Did you finish your goals for today?',
				'What will you work on tomorrow?'
			]),
			slackChannelName: null,
			slackChannelId: null,
			nextPublishDate: '2019-05-09 14:00:00',
			active: true
		}
	]);
};
