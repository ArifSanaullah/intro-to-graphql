import React from 'react';
import { NavLink } from 'react-router-dom';

import './MainNavigation.css';

function MainNavigation({ authState: { isLoggedIn } }) {
	return (
		<header className="main-navigation">
			<div className="main-navigation__logo">
				<h1>EasyEvent</h1>
			</div>
			<nav className="main-navigation__items">
				<ul>
					<li className="main-navigation__item">
						<NavLink to="/events">Events</NavLink>
					</li>
					{isLoggedIn && (
						<li className="main-navigation__item">
							<NavLink to="/bookings">Bookings</NavLink>
						</li>
					)}
					<li className="main-navigation__item">
						<NavLink to="/auth">Account</NavLink>
					</li>
				</ul>
			</nav>
		</header>
	);
}

export default MainNavigation;
