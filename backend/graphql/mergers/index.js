/* eslint-disable no-useless-catch */
const User = require('../../models/user');
const Event = require('../../models/event');
const { dateToString } = require('../../helpers/date');

const user = async (userId) => {
	try {
		const user = await User.findById(userId);

		return {
			...user._doc,
			password: null,
			createdEvents: getEvents.bind(this, user._doc.createdEvents),
		};
	} catch (error) {
		console.log('🚀 ~ file: app.js ~ user ~ line 20 ~ user ~ error', error);
		throw error;
	}
};

const getEvents = async (eventIds) => {
	try {
		const events = await Event.find({ _id: { $in: eventIds } });

		return events.map((event) => {
			return transformEvent(event);
		});
	} catch (error) {
		throw error;
	}
};

const getEvent = async (eventId) => {
	try {
		const event = await Event.findById(eventId);

		return await transformEvent(event);
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
