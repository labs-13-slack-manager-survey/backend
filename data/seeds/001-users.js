const moment = require('moment-timezone');
const jstz = require('jstz');
const faker = require('faker');
const bcrypt = require('bcryptjs');

exports.seed = function(knex) {
	const userSeeds = num => {
		const users = [];
		let team = 1;
		let count = 1;
		const joinCode = length => {
			return Math.round(
				Math.pow(36, length + 1) - Math.random() * Math.pow(36, length)
			)
				.toString(36)
				.slice(1);
		};

		for (let i = 0; i < num; i++) {
			users.push({
				teamId: team,
				email: faker.internet.email(),
				password: bcrypt.hashSync('password', 4),
				fullName: faker.name.firstName(),
				roles: count === 1 ? 'admin' : 'member',
				profilePic: '',
				created_at: moment().format(),
				timezone: jstz.determine().name(),
				joinCode: count === 1 ? joinCode(6) : null,
				active: true,
				slackToken: null,
				slackUserId: null,
				slackTeamId: null
			});

			if (count + 1 === 6) {
				count = 1;
				team++;
			} else {
				count++;
			}
		}
		console.log(users);
		return users;
	};
	return knex('users').insert(userSeeds(25));
};
