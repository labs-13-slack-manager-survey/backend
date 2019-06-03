const moment = require('moment');

exports.seed = function(knex) {
	return knex('responses').insert([
		{
			reportId: 1,
			userId: 2,
			question: 'How do you feel today?',
			answer: 'I feel happy today',
			submitted_date: moment().format()
		},
		{
			reportId: 1,
			userId: 2,
			question: 'What did you get done today?',
			answer: 'I made a log in component.',
			submitted_date: moment().format()
		},
		{
			reportId: 1,
			userId: 2,
			question: 'Did you finish your goals for today?',
			answer: 'Yes',
			submitted_date: moment().format()
		},
		{
			reportId: 1,
			userId: 2,
			question: 'What will you work on tomorrow?',
			answer: 'Integrating OAuth',
			submitted_date: moment().format()
		},
		{
			reportId: 1,
			userId: 3,
			question: 'How do you feel today?',
			answer: 'I feel happy today',
			submitted_date: moment().format()
		},
		{
			reportId: 1,
			userId: 3,
			question: 'What did you get done today?',
			answer: 'I made a few endpoints.',
			submitted_date: moment().format()
		},
		{
			reportId: 1,
			userId: 3,
			question: 'Did you finish your goals for today?',
			answer: 'Yes',
			submitted_date: moment().format()
		},
		{
			reportId: 1,
			userId: 3,
			question: 'What will you work on tomorrow?',
			answer: 'Integrating firebase endpoint',
			submitted_date: moment().format()
		},
		{
			reportId: 1,
			userId: 4,
			question: 'How do you feel today?',
			answer: 'I feel sad today.',
			submitted_date: moment().format()
		},
		{
			reportId: 1,
			userId: 4,
			question: 'What did you get done today?',
			answer: 'I was in meetings all day.',
			submitted_date: moment().format()
		},
		{
			reportId: 1,
			userId: 4,
			question: 'Did you finish your goals for today?',
			answer: 'No',
			submitted_date: moment().format()
		},
		{
			reportId: 1,
			userId: 4,
			question: 'What will you work on tomorrow?',
			answer: 'Catching up on registration work.',
			submitted_date: moment().format()
		},
		{
			reportId: 1,
			userId: 5,
			question: 'How do you feel today?',
			answer: 'I feel angry today',
			submitted_date: moment().format()
		},
		{
			reportId: 1,
			userId: 5,
			question: 'What did you get done today?',
			answer: 'My laptop broke today so nothing.',
			submitted_date: moment().format()
		},
		{
			reportId: 1,
			userId: 5,
			question: 'Did you finish your goals for today?',
			answer: 'No',
			submitted_date: moment().format()
		},
		{
			reportId: 1,
			userId: 5,
			question: 'What will you work on tomorrow?',
			answer: 'Setting up my new laptop',
			submitted_date: moment().format()
		}
	]);
};
