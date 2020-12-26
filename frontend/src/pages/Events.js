import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

import CreateEventModal from '../components/Events/CreateEventModal';
import { AuthContext } from '../store/contexts/authContext';
import Event from '../components/Events/Event';
import Loader from '../components/Loader';
import './Events.css';

function Events() {
	const {
		state: { isLoggedIn },
	} = useContext(AuthContext);

	const [events, setEvents] = useState([]);

	useEffect(() => {
		let didMount = true;
		const fetchEvents = async () => {
			try {
				const {
					data: {
						data: { events },
					},
				} = await axios.post('http://localhost:8000/graphql', {
					query: `query {
					events {
						title
						_id
						price
						date
						description
						creator {
							_id
						}
					}
				}`,
				});

				if (didMount) {
					setEvents(events);
				}

				return () => {
					didMount = false;
				};
			} catch (error) {
				if (didMount) {
					toast.error('Something went wrong');
				}
			}
		};
		fetchEvents();
	}, []);

	return (
		<div className="d-flex justify-content-center flex-column align-items-center">
			<ToastContainer />
			{isLoggedIn && (
				<div className="border d-flex flex-column create-event-cta align-items-center">
					<p>Share your own event!</p>
					<CreateEventModal
						contentLabel="Add an event"
						subtitle="Create an event"
						openModalButtonText="Create an event"
						onEventCreated={setEvents}
					/>
				</div>
			)}
			<ul className="events__list">
				{events.length ? (
					events.map(
						({ title, _id, price, creator, date, description }) => (
							<Event
								title={title}
								key={_id}
								price={price}
								creator={creator._id}
								date={date}
								_id={_id}
								description={description}
							/>
						)
					)
				) : (
					<Loader />
				)}
			</ul>
		</div>
	);
}

export default Events;
