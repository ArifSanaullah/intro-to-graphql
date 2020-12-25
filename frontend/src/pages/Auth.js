import { useState, useContext } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

import { AuthContext } from '../store/contexts/authContext';
import { LOGIN, LOGOUT } from '../store/actionTypes';
import './Auth.css';

function Auth() {
	const [form, setForm] = useState({
		email: '',
		password: '',
		isLoginMode: true,
		loading: false,
	});

	const history = useHistory();

	const {
		state: { isLoggedIn },
		dispatch,
	} = useContext(AuthContext);

	const onChangeHandler = ({ target: { name, value } }) => {
		setForm({ ...form, [name]: value.trim() });
	};

	const onSubmit = async (e) => {
		e.preventDefault();
		const { email, password } = form;

		if (!email || !password) {
			return toast.error('Please Enter email and password');
		}

		let requestBody = {
			query: `query {
    	        	login(email: "${email}", password: "${password}") {
        	      		userId
				  		token
			  			tokenExpiration
            		}
        		}`,
		};

		if (!form.isLoginMode) {
			requestBody = {
				query: `mutation {
            				createUser(userInput: {email: "${email}", password: "${password}"}) {
              					_id
              					email
            				}
          				}`,
			};
		}

		try {
			setForm({ ...form, loading: true });

			const {
				data: { data, errors },
			} = await axios.post('http://localhost:8000/graphql', requestBody, {
				headers: { 'Content-Type': 'application/json' },
			});

			if (errors?.length > 0) {
				setForm({ ...form, loading: false });
				return errors.forEach((error) => {
					toast.error(error.message);
				});
			}

			if (form.isLoginMode) {
				const {
					login: { userId, token, expirationTime },
				} = data;

				dispatch({
					type: LOGIN,
					payload: { userId, token, expirationTime },
				});

				toast.success('You are now logged in');
				setForm({
					email: '',
					password: '',
					isLoginMode: true,
					loading: false,
				});
				history.push('/events');
			} else {
				const { createUser } = data;
				console.log(createUser);
			}
		} catch (error) {
			toast.error("Something isn't right!");
			setForm({ ...form, loading: false });
		}
	};

	return (
		<form className="auth-form">
			{isLoggedIn ? (
				<button
					className="btn btn-primary"
					onClick={() => dispatch({ type: LOGOUT })}
				>
					Logout
				</button>
			) : (
				<>
					<div className="form-group">
						<label htmlFor="email">Email</label>
						<input
							value={form.email}
							onChange={onChangeHandler}
							type="text"
							className="form-control"
							id="email"
							name="email"
						/>
						<ToastContainer />
					</div>
					<div className="form-group">
						<label htmlFor="password">Password</label>
						<input
							value={form.password}
							onChange={onChangeHandler}
							type="password"
							className="form-control"
							id="password"
							name="password"
						/>
					</div>
					<div className="ctas">
						<button
							className="btn-primary btn"
							onClick={(e) => {
								e.preventDefault();
								setForm({
									...form,
									isLoginMode: !form.isLoginMode,
								});
							}}
						>
							Switch to {form.isLoginMode ? 'Signup' : 'Login'}
						</button>
						<button
							className="btn-primary btn"
							onClick={onSubmit}
							disabled={form.loading}
						>
							{form.isLoginMode && !form.loading
								? 'Login'
								: !form.isLoginMode && !form.loading
								? 'Signup'
								: 'Please wait'}
						</button>
					</div>
				</>
			)}
		</form>
	);
}

export default Auth;
