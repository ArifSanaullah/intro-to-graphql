import { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

import { AuthContext } from '../store/contexts/authContext';
import Loader from '../components/Loader';
import BookingsChart from '../components/Bookings/BookingsChart';

function Bookings() {
	const [bookings, setBookings] = useState([]);
	const [contentType, setContentType] = useState('list');

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
						price
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
			query: `mutation CancelBooking($id: ID!) {
						cancelBooking(bookingId: $id) {
							title
							_id
						}
					}`,
			variables: {
				id: bookingId,
			},
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

	let content = <Loader />;

	if (contentType === 'list' && bookings.length) {
		content = (
			<ul className="bookings">
				{bookings?.map((booking) => (
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
		);
	}

	if (contentType === 'chart') {
		content = <BookingsChart bookings={bookings} />;
	}

	return (
		<div>
			<div className="switchs-container">
				<div className="switchs">
					<button
						className={`${
							contentType === 'list'
								? 'switch-btn active'
								: 'switch-btn'
						}`}
						onClick={() => setContentType('list')}
					>
						List
					</button>
					<button
						className={`${
							contentType === 'chart'
								? 'switch-btn active'
								: 'switch-btn'
						}`}
						onClick={() => setContentType('chart')}
					>
						Chart
					</button>
				</div>
			</div>
			{content}
			<ToastContainer />
		</div>
	);
}

export default Bookings;
