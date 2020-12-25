import './Loader.css';

function Loader() {
	return (
		<div className="d-flex align-items-center justify-content-center" >
			<div className="lds-ring">
				<div></div>
				<div></div>
				<div></div>
				<div></div>
			</div>
		</div>
	);
}

export default Loader;
