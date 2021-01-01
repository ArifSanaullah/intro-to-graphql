import { useState, useContext, useCallback } from 'react';
import Modal from 'react-modal';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';

import { AuthContext } from '../../store/contexts/authContext';

const customStyles = {
	content: {
		top: '50%',
		left: '50%',
		right: 'auto',
		bottom: 'auto',
		marginRight: '-50%',
		transform: 'translate(-50%, -50%)',
	},
};

Modal.setAppElement('#root');

function CreateEventModal({ subtitle, openModalButtonText, event }) {
	const [modalIsOpen, setIsOpen] = useState(false);

	const {
		state: { token, userId },
	} = useContext(AuthContext);

	const onBookHandler = useCallback(
		async (e) => {
			e.preventDefault();

			if (!token || !userId) {
				return toast.warning('Please login to book an event');
			}

			const requestBody = {
				query: `mutation BookEvent($id: ID!) { 
							bookEvent(eventId: $id) {
                				_id
                				createdAt
            				}
						}`,
				variables: {
					id: event._id,
				},
			};

			try {
				const {
					data: { errors },
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

				toast.success('Booked');
				closeModal();
			} catch (error) {
				toast.error('Something went wrong');
				closeModal();
			}
		},

		[event._id, token, userId]
	);

	function openModal() {
		setIsOpen(true);
	}

	function afterOpenModal() {}

	function closeModal() {
		setIsOpen(false);
	}

	return (
		<div>
			<ToastContainer />
			<button onClick={openModal} className="btn btn-primary">
				{openModalButtonText}
			</button>
			<Modal
				isOpen={modalIsOpen}
				onAfterOpen={afterOpenModal}
				onRequestClose={closeModal}
				style={customStyles}
			>
				<div className="header">
					<h2 ref={(_subtitle) => (subtitle = _subtitle)}>
						{subtitle}
					</h2>
				</div>
				<div className="view-event-content">
					<h1>{event.title}</h1>
					<h2>
						${event.price} -{' '}
						{new Date(event.date).toLocaleTimeString('en-EN')}&nbsp;
						{new Date(event.date).toLocaleDateString('en-EN')}
					</h2>
					<p>{event.description}</p>
				</div>
				<div className="footer">
					<button onClick={closeModal} className="btn btn-primary">
						Close
					</button>
					<button className="btn btn-primary" onClick={onBookHandler}>
						Book event
					</button>
				</div>
			</Modal>
		</div>
	);
}

export default CreateEventModal;
