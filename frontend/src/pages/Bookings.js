import { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

import { AuthContext } from '../store/contexts/authContext';
import Loader from '../components/Loader';

function Bookings() {
	const [bookings, setBookings] = useState([]);

	const {
		state: { token },
	} = useContext(AuthContext);

	const fetchBookings = useCallback(() => {
		const getBookings = async () => {
			const requestBody = {
				query: `query {
				bookings {
					_id
					createdAt
					event {
						title
					}
				}
			}`,
			};

			try {
				const {
					data: { data, errors },
				} = await axios.post(
					'http://localhost:8000/graphql',
					requestBody,
					{
						headers: { Authorization: `Bearer ${token}` },
					}
				);

				if (errors?.length) {
					return errors.forEach((error) => {
						toast.error(error.message);
					});
				}

				setBookings(data.bookings);
			} catch (error) {
				toast.error('Something went wrong');
			}
		};
		getBookings();
	}, [token]);

	useEffect(() => {
		fetchBookings();
	}, [fetchBookings]);

	const onCancelBooking = async (bookingId) => {
		const requestBody = {
			query: `mutation {
			cancelBooking(bookingId: "${bookingId}") {
				title
				_id
			}
		}`,
		};

		try {
			await axios.post('http://localhost:8000/graphql', requestBody, {
				headers: { Authorization: `Bearer ${token}` },
			});

			fetchBookings();

			toast.success('Booking deleted successfully');
		} catch (error) {
			toast.error('something went wrong');
		}
	};

	return (
		<div>
			{bookings.length ? (
				<ul className="bookings">
					{bookings.map((booking) => (
						<li key={booking._id} className="booking">
							<div className="booking-content">
								{booking.event.title} -{' '}
								{new Date(booking.createdAt).toLocaleTimeString(
									'en-EN'
								)}
								&nbsp;
								{new Date(booking.createdAt).toLocaleDateString(
									'en-EN'
								)}
							</div>
							<div className="booking-actions">
								<button
									className="btn btn-primary"
									onClick={() => onCancelBooking(booking._id)}
								>
									Cancel booking
								</button>
							</div>
						</li>
					))}
				</ul>
			) : (
				<Loader />
			)}
			<ToastContainer />
		</div>
	);
}

export default Bookings;
