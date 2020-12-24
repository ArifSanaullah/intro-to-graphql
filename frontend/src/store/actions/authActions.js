const login = (state, action) => {
	const { token, userId, expirationTime } = action.payload;
	return {
		...state,
		token,
		userId,
		expirationTime,
		isLoggedIn: true,
	};
};

const logout = (state) => {
	return {
		...state,
		userId: null,
		token: null,
		expirationTime: null,
		isLoggedIn: false,
	};
};

export { login, logout };
