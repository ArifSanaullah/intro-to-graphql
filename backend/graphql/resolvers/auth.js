const bcrypt = require('bcryptjs');
const User = require('../../models/user');

module.exports = {
	createUser: async ({ userInput }) => {
		try {
			const existingUser = await User.findOne({ email: userInput.email });

			if (existingUser) {
				throw new Error('User already exists with provided details');
			} else {
				const { email, _id } = await User.create({
					...userInput,
					password: await bcrypt.hash(userInput.password, 12),
				});

				return { email, _id };
			}
		} catch (error) {
			console.log(
				'🚀 ~ file: app.js ~ line 99 ~ createUser: ~ error',
				error
			);
			throw error;
		}
	},
};
