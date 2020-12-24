import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import { useReducer } from 'react';

import Auth from './pages/Auth';
import Events from './pages/Events';
import Bookings from './pages/Bookings';
import MainNavigation from './components/navigation/MainNavigation';
import {
	reducer as authReducer,
	initialState as authInitialState,
} from './store/reducers/authReducer';
import { AuthContextProvider } from './store/contexts/authContext';
import './App.css';

function App() {
	const [authState, authDispatch] = useReducer(authReducer, authInitialState);

	return (
		<div className="App">
			<AuthContextProvider
				value={{ state: authState, dispatch: authDispatch }}
			>
				<BrowserRouter>
					<>
						<MainNavigation authState={authState} />
						<main className="main-content">
							<Switch>
								<Redirect from="/" to="/auth" exact />
								<Route path="/auth" component={Auth} />
								<Route path="/events" component={Events} />
								{authState.isLoggedIn && (
									<Route
										path="/bookings"
										component={Bookings}
									/>
								)}
							</Switch>
						</main>
					</>
				</BrowserRouter>
			</AuthContextProvider>
		</div>
	);
}

export default App;
