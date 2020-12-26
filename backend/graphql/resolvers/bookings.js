/* eslint-disable no-useless-catch */
const Booking = require('../../models/booking');
const { transformBooking, transformEvent } = require('../mergers');
const Event = require('../../models/event');

module.exports = {
	bookings: async (args, req) => {
		if (!req.isAuth) {
			throw new Error('Unauthorized');
		}

		try {
			const bookings = await Booking.find({ user: req.userId });

			return bookings.map(transformBooking);
		} catch (error) {
			console.log(
				'🚀 ~ file: index.js ~ line 106 ~ bookings: ~ error',
				error
			);
			throw error;
		}
	},
	bookEvent: async ({ eventId }, req) => {
		if (!req.isAuth) {
			throw new Error('Unauthorized');
		}

		try {
			const event = await Event.findById(eventId);

			const newBooking = await Booking.create({
				user: req.userId,
				event,
			});

			return transformBooking(newBooking);
		} catch (error) {
			console.log(
				'🚀 ~ file: index.js ~ line 120 ~ bookEvent: ~ error',
				error
			);
			throw error;
		}
	},

	cancelBooking: async ({ bookingId }, req) => {
		if (!req.isAuth) {
			throw new Error('Unauthorized');
		}

		try {
			const booking = await Booking.findById(bookingId).populate('event');

			await Booking.findByIdAndDelete(bookingId);

			return transformEvent(booking.event);
		} catch (error) {
			throw error;
		}
	},
};
