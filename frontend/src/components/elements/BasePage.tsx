import React from 'react';

import { PageProps } from '../../utils';

import NavBar from './NavBar';
import AlertBar from './AlertBar';

import './BasePage.css';
import { Col, Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import PACKAGE_JSON from '../../../package.json';

interface Props extends PageProps { }
interface State { }

export default class BasePage extends React.PureComponent<Props, State> {
	// constructor(props: Props) {
	//   super(props);
	// }
	async componentDidMount() {
		this.props.checkBasketAvailabilities();
	}

	render() {
		return (
			<React.Fragment>
				<div className="master">
					<img
						alt=''
						src={process.env.PUBLIC_URL + '/logo_main.png'}
						className='logo'
					/>{' '}
					<NavBar />

					<div className='mainbody'>
						<AlertBar {...this.props} />

						{this.props.children}
					</div>
				</div>

				<footer className='footer mt-auto py-3 bg-transparent text-black'>
					<Container>
						<Row>
							<Col>
								Nouvique 2021 v{PACKAGE_JSON.version}
							</Col>
							<Col>
								<div style={{ float: 'right' }}>
									<Link to='/support'>
										Support
									</Link>
								</div>
							</Col>
						</Row>
					</Container>
				</footer>
			</React.Fragment>
		)
	}
}