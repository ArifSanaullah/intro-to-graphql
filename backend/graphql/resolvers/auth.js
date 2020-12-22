const bcrypt = require('bcryptjs');

const User = require('../../models/user');
const jwt = require('jsonwebtoken');

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
	login: async ({ email, password }) => {
		const foundUser = await User.findOne({ email });
		if (!foundUser) {
			throw new Error('Invalid credentials');
		}
		const passowrdsMatch = await bcrypt.compare(
			password,
			foundUser.password
		);

		if (!passowrdsMatch) {
			throw new Error('Invalid credentials');
		}
		const token = await jwt.sign(
			{ userId: foundUser._id, email: foundUser.email },
			'MY_PRIVATE_SECRET_KEY',
			{ expiresIn: '1h' }
		);
		return { userId: foundUser._id, token, tokenExpiration: 1 };
	},
};
