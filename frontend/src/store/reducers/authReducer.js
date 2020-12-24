import { LOGIN, LOGOUT } from '../actionTypes';
import { login, logout } from '../actions/authActions';

export const initialState = {
	token: null,
	userId: null,
	expirationTime: null,
	isLoggedIn: false,
};

export const reducer = (state = initialState, action) => {
	switch (action.type) {
		case LOGIN:
			return login(state, action);
		case LOGOUT:
			return logout(state);
		default:
			return state;
	}
};
