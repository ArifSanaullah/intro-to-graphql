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
	createEvent: async (
		{ eventInput: { title, description, price, date } },
		req
	) => {
		if (!req.isAuth) {
			throw new Error('Unauthorized');
		}
		try {
			const creator = await User.findById(req.userId);

			if (!creator) {
				throw new Error('User not found.');
			}

			const event = new Event({
				title,
				description,
				price: +price,
				date: new Date(date),
				creator: req.userId,
			});

			const result = await event.save();
			const createdEvent = transformEvent(result);

			creator.createdEvents.push(event);
			await creator.save();

			return createdEvent;
		} catch (error) {
			console.log(
				'🚀 ~ file: app.js ~ line 63 ~ createEvent: ~ error',
				error
			);
			throw error;
		}
	},
};
