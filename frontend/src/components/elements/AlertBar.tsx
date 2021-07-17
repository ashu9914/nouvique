import React from 'react';

import { Alert } from 'react-bootstrap';

import { PageProps } from '../../utils';

interface Props extends PageProps { };
interface State {
	"show": boolean
};

export default class AlertBar extends React.Component<Props, State> {
	// constructor(props: PageProps) {
	// 	super(props);
	// }

	handleClose = async () => {
		var currAlert = this.props.alert;
		currAlert.show = false;
		this.props.updateAlertBar(this.props.alert.message, this.props.alert.variant, this.props.alert.show);
	}

	render() {
		return (
			<React.Fragment>
				<Alert show={this.props.alert.show} variant={this.props.alert.variant} onClose={this.handleClose} dismissible>
					{this.props.alert.message}
				</Alert>
			</React.Fragment>
		);
	}
}