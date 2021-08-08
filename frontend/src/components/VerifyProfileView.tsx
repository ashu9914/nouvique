import React from 'react';

import { Result } from 'neverthrow';
import { RouteComponentProps } from 'react-router';

import BasePage from './elements/BasePage';

import { resolveGETCall, PageProps, UserVerifyREST, verifyUserRESTLink } from '../utils';

interface MatchParams {
	username: string,
	account_id: string
}

interface Props extends RouteComponentProps<MatchParams>, PageProps { }

const UNABLE_TO_VERIFY_MESSAGE: string = "Unable to verify account. Please make sure that you have created and completed your Stripe account creation, including submitting all necessary documents and details. You can update your stripe account via your profile settings. If you have verified this, try re-logging in and retrying.";

export default class VerifyProfileView extends React.Component<Props> {
	async componentDidMount() {
		const path: string = verifyUserRESTLink + this.props.match.params.username + '/' + this.props.match.params.account_id + '/';
		const result: Result<UserVerifyREST, Error> = await resolveGETCall<UserVerifyREST>(path, true);

		result
			.map(res => {
				if (res.verified) {
					this.props.updateAlertBar(UNABLE_TO_VERIFY_MESSAGE, "success", true);
					this.props.history.push('/profile/' + this.props.match.params.username);
				} else {
					this.props.updateAlertBar(UNABLE_TO_VERIFY_MESSAGE, "danger", true);
					this.props.history.push('/profile/' + this.props.match.params.username);
				}

				return null; // necessary to silence warning
			})
			.mapErr(err => {
				// cannot be authenticated with the user therefore, jwt tokens must not be correct, therefore, deny form access
				console.error(err);

				this.props.updateAlertBar(UNABLE_TO_VERIFY_MESSAGE, "danger", true);
				this.props.history.push('/profile/' + this.props.match.params.username);
			});
	}

	render() {
		return (
			<BasePage {...this.props}>
				<React.Fragment>
					Attempting to verify profile...
				</React.Fragment>
			</BasePage>
		)
	}
}