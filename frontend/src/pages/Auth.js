import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';

import './Auth.css';

function Auth() {
	const [form, setForm] = useState({
		email: '',
		password: '',
		isLoginMode: true,
	});

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
			const {
				data: { data, errors },
			} = await axios.post('http://localhost:8000/graphql', requestBody, {
				headers: { 'Content-Type': 'application/json' },
			});

			if (errors?.length > 0) {
				console.log({ data, errors });
				return errors.forEach((error) => {
					toast.error(error.message);
				});
			}

			console.log({ data });
		} catch (error) {
			toast.error("Something isn't right!");
		}
	};

	return (
		<form className="auth-form">
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
						setForm({ ...form, isLoginMode: !form.isLoginMode });
					}}
				>
					Switch to {form.isLoginMode ? 'Signup' : 'Login'}
				</button>
				<button className="btn-primary btn" onClick={onSubmit}>
					{form.isLoginMode ? 'Login' : 'Signup'}
				</button>
			</div>
		</form>
	);
}

export default Auth;
