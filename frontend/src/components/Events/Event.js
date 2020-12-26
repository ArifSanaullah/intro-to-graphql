import { useContext } from 'react';

import { AuthContext } from '../../store/contexts/authContext';
import ViewEvent from '../../components/Events/ViewEvent';

function Event({ title, price, creator, date, _id, description }) {
	const {
		state: { userId },
	} = useContext(AuthContext);

	return (
		<li className="events__list-item">
			<div>
				<h1>{title}</h1>
				<h2>
					${price} - {new Date(date).toLocaleDateString('en-EN')}
				</h2>
			</div>
			<div>
				{!creator || creator !== userId ? (
					<ViewEvent
						event={{ _id, title, description, price, date }}
						openModalButtonText="View event"
						subtitle="Book event"
					/>
				) : (
					<p>You're the owner of this event</p>
				)}
			</div>
		</li>
	);
}

export default Event;
