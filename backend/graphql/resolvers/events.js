/* eslint-disable no-useless-catch */
const User = require('../../models/user');
const Event = require('../../models/event');
const { transformEvent } = require('../mergers');

module.exports = {
	events: async () => {
		try {
			const events = await Event.find();

			return Promise.all(events.map(transformEvent)).then((events) => {
				return events;
			});
		} catch (error) {
			console.log('🚀 ~ file: app.js ~ line 50 ~ events: ~ error', error);
			throw error;
		}
	},
	createEvent: async ({
		eventInput: { title, description, price, date },
	}) => {
		try {
			const event = new Event({
				title,
				description,
				price: +price,
				date: new Date(date),
				creator: '5fdf0753179a22d3e86004ba',
			});

			let createdEvent;

			const result = await event.save();
			createdEvent = transformEvent(result);

			const creator = await User.findById('5fdf0753179a22d3e86004ba');

			if (!creator) {
				throw new Error('User not found.');
			} else {
				creator.createdEvents.push(event);
				await creator.save();

				return createdEvent;
			}
		} catch (error) {
			console.log(
				'🚀 ~ file: app.js ~ line 63 ~ createEvent: ~ error',
				error
			);
			throw error;
		}
	},
};
