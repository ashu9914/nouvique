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
          <Navbar.Brand href='/'>
            <img
              alt=''
              src={process.env.PUBLIC_URL + '/logo192.png'}
              className='nav-bar-logo d-inline-block align-top'
            />{' '}
            TeleView
          </Navbar.Brand>

          <Navbar.Collapse className='justify-content-end'>
            <Nav className='mr-auto'>
              <Nav.Item>
                <NavLink
                  className='nav-link nav-right-side'
                  isActive={(match, location) => location.pathname === '/'}
                  activeClassName='nav-link active nav-right-side'
                  to={{ pathname: '/' }}>
                  Home
              </NavLink>
              </Nav.Item>

              <Nav.Item>
                <NavLink
                  className='nav-link nav-right-side'
                  activeClassName='nav-link active nav-right-side'
                  to={{ pathname: '/media' }}>
                  Media
              </NavLink>
              </Nav.Item>

              <Nav.Item>
                {localStorage.userName && localStorage.userName !== '' ?
                  <NavLink
                    className='nav-link nav-right-side'
                    activeClassName='nav-link active nav-right-side'
                    to={{ pathname: '/profile/' + localStorage.userName }}>
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

              {localStorage.userName && localStorage.userName !== '' ?
                <Navbar.Text className='nav-right-end'>
                  Hi, <a href={'/profile/' + localStorage.userName}>{localStorage.userName}</a>
                </Navbar.Text>
                :
                <Nav.Item>
                  <NavLink
                    className='nav-link nav-right-end'
                    activeClassName='nav-link active'
                    to={{ pathname: '/login' }}>
                    Login/Signup
                </NavLink>
                </Nav.Item>
              }
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </React.Fragment>
    )
  }
}