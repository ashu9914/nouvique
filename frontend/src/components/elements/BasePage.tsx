import React from 'react';

import { PageProps } from '../../utils';

import NavBar from './NavBar';
import AlertBar from './AlertBar';

import './BasePage.css';

interface Props extends PageProps { }
interface State { }

export default class BasePage extends React.PureComponent<Props, State> {
	// constructor(props: Props) {
	//   super(props);
	// }

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

			</React.Fragment>
		)
	}
}