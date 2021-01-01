/* eslint-disable no-useless-catch */
const DataLoader = require('dataloader');

const User = require('../../models/user');
const Event = require('../../models/event');
const { dateToString } = require('../../helpers/date');

const eventLoader = new DataLoader((evendIds) => getEvents(evendIds));
const userLoader = new DataLoader((userIds) => {
	return User.find({ _id: { $in: userIds } });
});

const user = async (userId) => {
	try {
		const user = await userLoader.load(userId.toString());

		return {
			...user._doc,
			password: null,
			createdEvents: await eventLoader.loadMany(user._doc.createdEvents),
		};
	} catch (error) {
		console.log('🚀 ~ file: app.js ~ user ~ line 20 ~ user ~ error', error);
		throw error;
	}
};

const getEvents = async (eventIds) => {
	try {
		const events = await Event.find({ _id: { $in: eventIds } });

		return events
			.map((event) => {
				return transformEvent(event);
			})
			.sort((a, b) => a._id.toString() - b._id.toString());
	} catch (error) {
		throw error;
	}
};

const getEvent = async (eventId) => {
	try {
		const event = await eventLoader.load(eventId.toString());

		return event;
	} catch (error) {
		throw error;
	}
};

const transformBooking = (booking) => {
	return {
		...booking._doc,
		createdAt: dateToString(booking._doc.createdAt),
		updatedAt: dateToString(booking._doc.updatedAt),
		event: getEvent.bind(this, booking._doc.event),
		user: user.bind(this, booking.user),
	};
};

const transformEvent = (event) => {
	return {
		...event._doc,
		creator: user.bind(this, event.creator),
		date: dateToString(event._doc.date),
	};
};

module.exports = {
	transformEvent,
	user,
	getEvents,
	getEvent,
	transformBooking,
};
