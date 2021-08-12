import React from 'react';

import { NavLink } from 'react-router-dom';
import { Nav, Navbar } from 'react-bootstrap';

import './NavBar.css';

interface Props { }

interface State { }

export default class NavBar extends React.PureComponent<Props, State> {
	// constructor(props: Props) {
	//   super(props);
	// }

	render() {
		return (
			<React.Fragment>
				<Navbar bg='transparent' variant='light'>
					{/* <LinkContainer to='/'>
						<Navbar.Brand>
							<img
								alt=''
								src={process.env.PUBLIC_URL + '/logo192.png'}
								className='nav-bar-logo d-inline-block align-top'
							/>{' '}
							Nouvique
						</Navbar.Brand>
					</LinkContainer> */}

					<Navbar.Collapse className='justify-content-center'>
						<Nav className='mr-auto nav_style'>
							<Nav.Item className="item_style">
								<NavLink
									className='nav-link'
									isActive={(match, location) => location.pathname === '/'}
									activeClassName='nav-link active'
									to={{ pathname: '/' }}>
									Home
								</NavLink>
							</Nav.Item>

							<Nav.Item className="item_style">
								<NavLink
									className='nav-link'
									activeClassName='nav-link active'
									to={{ pathname: '/browse' }}>
									Browse
								</NavLink>
							</Nav.Item>

							<Nav.Item className="item_style">
								<NavLink
									className='nav-link'
									activeClassName='nav-link active'
									to={{ pathname: '/ethics' }}>
									Ethics
								</NavLink>
							</Nav.Item>

							<Nav.Item className="item_style">
								{(localStorage.getItem("username") && localStorage.getItem("username") !== '') ?
									<NavLink
										className='nav-link nav-right-side'
										activeClassName='nav-link active nav-right-side'
										to={{ pathname: '/profile/' + localStorage.username }}>
										Profile
										</NavLink>
									:
									<NavLink
										className='nav-link nav-right-side'
										isActive={(match, location) => location.pathname === '/profile/*'}
										activeClassName='nav-link active nav-right-side'
										to={{ pathname: '/login' }}>
										Profile
										</NavLink>
								}
							</Nav.Item>

							{/* 
							{(localStorage.getItem("username") && localStorage.getItem("username") !== '') ?
								<Nav.Item className="item_style">
									<NavLink
										className=''
										to={{ pathname: '/profile/' + localStorage.getItem("username") }}>
										Hi, <u>{localStorage.getItem("username")}</u>
									</NavLink>
								</Nav.Item>
								:
								<Nav.Item className="item_style">
									<NavLink
										className='nav-link'
										activeClassName='nav-link active'
										to={{ pathname: '/login' }}>
										Login
										</NavLink>
								</Nav.Item>
							} */}
						</Nav>
					</Navbar.Collapse>
				</Navbar>
			</React.Fragment>
		)
	}
}
