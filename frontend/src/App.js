import './App.css';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import Auth from './pages/Auth';
import Events from './pages/Events';
import Bookings from './pages/Bookings';
import MainNavigation from './components/navigation/MainNavigation';

function App() {
	return (
		<div className="App">
			<BrowserRouter>
				<>
					<MainNavigation />
					<main className="main-content">
						<Switch>
							<Redirect from="/" to="/auth" exact />
							<Route path="/auth" component={Auth} />
							<Route path="/events" component={Events} />
							<Route path="/bookings" component={Bookings} />
						</Switch>
					</main>
				</>
			</BrowserRouter>
		</div>
	);
}

export default App;
