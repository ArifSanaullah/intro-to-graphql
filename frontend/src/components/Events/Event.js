import { useContext } from 'react';

import { AuthContext } from '../../store/contexts/authContext';

function Event({ title, price, creator, date }) {
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
					<button className="btn btn-primary">View details</button>
				) : (
					<p>You're the owner of this event</p>
				)}
			</div>
		</li>
	);
}

export default Event;
