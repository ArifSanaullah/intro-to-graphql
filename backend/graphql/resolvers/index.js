const eventResolvers = require('./events');
const bookingResolvers = require('./bookings');
const authResolvers = require('./auth');

module.exports = {
	...authResolvers,
	...eventResolvers,
	...bookingResolvers,
};
