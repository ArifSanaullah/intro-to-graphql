/* eslint-disable no-useless-catch */
const Booking = require('../../models/booking');
const { transformBooking, transformEvent } = require('../mergers');
const Event = require('../../models/event');

module.exports = {
	bookings: async () => {
		try {
			const bookings = await Booking.find();

			return bookings.map(transformBooking);
		} catch (error) {
			console.log(
				'🚀 ~ file: index.js ~ line 106 ~ bookings: ~ error',
				error
			);
			throw error;
		}
	},
	bookEvent: async ({ eventId }) => {
		try {
			const event = await Event.findById(eventId);

			const newBooking = await Booking.create({
				user: '5fdf0753179a22d3e86004ba',
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

	cancelBooking: async ({ bookingId }) => {
		try {
			const booking = await Booking.findById(bookingId).populate('event');

			await Booking.findByIdAndDelete(bookingId);

			return transformEvent(booking.event);
		} catch (error) {
			throw error;
		}
	},
};
