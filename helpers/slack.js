const axios = require('axios');

const url = 'https://slack.com/api/im.open';
const postUrl = 'https://slack.com/api/chat.postMessage';

const headers = {
	'Content-type': 'application/json; charset=utf-8',
	Authorization: `Bearer ${process.env.SLACK_ACCESS_TOKEN}`
};

const button = async reports => {
	//console.log('got here');
	try {
		reports.map(async report => {
			report.users.map(async user => {
				const message = {
					user: user.slackUserId,
					include_locale: true,
					return_im: true
				};

				const { data } = await axios.post(url, message, { headers });

				const response = {
					channel: data.channel.id,
					attachments: [
						{
							blocks: [
								{
									type: 'section',
									text: {
										type: 'plain_text',
										text: `Please fill out your report: ${report.reportName}`
									},
									accessory: {
										type: 'button',
										text: {
											type: 'plain_text',
											text: 'Button',
											emoji: true
										},
										value: JSON.stringify(report)
									}
								}
							]
						}
					]
				};
				const responseMessage = await axios.post(postUrl, response, {
					headers
				});
				//console.log(responseMessage);
			});
		});
	} catch (err) {
		console.log(err);
	}
};

module.exports = {
	button
};
