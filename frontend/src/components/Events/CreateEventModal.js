import { useState, useContext } from 'react';
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

function CreateEventModal({
	contentLabel,
	subtitle,
	openModalButtonText,
	onEventCreated,
}) {
	const [modalIsOpen, setIsOpen] = useState(false);

	const {
		state: { token, userId },
	} = useContext(AuthContext);

	function openModal() {
		setIsOpen(true);
	}

	function afterOpenModal() {
		// references are now sync'd and can be accessed.
		// subtitle.style.color = '#f00';
	}

	function closeModal() {
		setIsOpen(false);
	}

	const [form, setForm] = useState({
		title: '',
		description: '',
		price: '',
		date: '',
	});

	const onSubmit = async (e) => {
		e.preventDefault();
		const { title, description, price, date } = form;

		if (
			!title.trim().length ||
			!description.trim().length ||
			!price.trim().length ||
			!date.trim().length
		) {
			return toast.error('Enter all fields to create an event');
		}

		const requestBody = {
			query: `mutation {
			createEvent(eventInput: { title: "${title}", description: "${description}", date: "${date}", price: ${+price} }) {
				_id
				title
				price
				date
				description
			}
		}`,
		};

		const {
			data: { errors, data },
		} = await axios.post('http://localhost:8000/graphql', requestBody, {
			headers: { Authorization: `Bearer ${token}` },
		});

		if (errors?.length) {
			return errors.forEach((error) => {
				toast.error(error.message);
			});
		}

		onEventCreated((events) => {
			return [
				...events,
				{ ...data.createEvent, creator: { _id: userId } },
			];
		});
		closeModal();
	};

	const onChangeHandler = (e) => {
		const { name, value } = e.target;
		setForm({ ...form, [name]: value });
	};

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
				contentLabel={contentLabel}
			>
				<div className="header">
					<h2 ref={(_subtitle) => (subtitle = _subtitle)}>
						{subtitle}
					</h2>
				</div>
				<div className="content">
					<form>
						<div className="form-group">
							<label htmlFor="title">Title</label>
							<input
								className="form-control"
								name="title"
								id="title"
								style={{ maxWidth: 'calc(100% - 2.2rem)' }}
								value={form.title}
								onChange={onChangeHandler}
							/>
						</div>
						<div className="form-group">
							<label htmlFor="description">Description</label>
							<input
								className="form-control"
								name="description"
								id="description"
								style={{ maxWidth: 'calc(100% - 2.2rem)' }}
								value={form.description}
								onChange={onChangeHandler}
							/>
						</div>
						<div className="form-group">
							<label htmlFor="price">Price</label>
							<input
								type="number"
								className="form-control"
								name="price"
								id="price"
								style={{ maxWidth: 'calc(100% - 2.2rem)' }}
								value={form.price}
								onChange={onChangeHandler}
							/>
						</div>
						<div className="form-group">
							<label htmlFor="date">Date</label>
							<input
								className="form-control"
								name="date"
								id="date"
								style={{ maxWidth: 'calc(100% - 2.2rem)' }}
								type="datetime-local"
								value={form.date}
								onChange={onChangeHandler}
							/>
						</div>
					</form>
				</div>
				<div className="footer">
					<button onClick={closeModal} className="btn btn-primary">
						Cancel
					</button>
					<button onClick={onSubmit} className="btn btn-primary">
						Create
					</button>
				</div>
			</Modal>
		</div>
	);
}

export default CreateEventModal;
