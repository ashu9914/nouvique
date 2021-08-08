import React from 'react';

import { Result } from 'neverthrow';
import { RouteComponentProps } from 'react-router';

import BasePage from './elements/BasePage';

import { UserStripeUpdateLinkREST, resolveGETCall, PageProps, userStripeUpdateLinkRESTLink } from '../utils';

import './RefreshUpdateStripeView.css';

interface MatchParams {
	username: string
}

export interface RefreshUpdateStripeViewProps extends RouteComponentProps<MatchParams>, PageProps { }

export class RefreshUpdateStripeView extends React.Component<RefreshUpdateStripeViewProps> {
	async componentDidMount() {
		const pathStripeUpdateLink: string = userStripeUpdateLinkRESTLink + this.props.match.params.username + '/';
		const resultStripeUpdateLink: Result<UserStripeUpdateLinkREST, Error> = await resolveGETCall<UserStripeUpdateLinkREST>(pathStripeUpdateLink, true);

		resultStripeUpdateLink
			.map(res => {
				window.location.href = res.update_link;

				return null; // necessary to silence warning
			})
			.mapErr(err => {
				// cannot be authenticated with the user therefore, jwt tokens must not be correct, therefore, deny form access
				console.error(err);

				this.props.updateAlertBar("User is not valid to update their Stripe account. Please re-log-in and try again", "danger", true);

				this.props.history.push('/');
			});
	}

	render() {
		return (
			<BasePage {...this.props}>
				<React.Fragment>
					Attempting to refresh Stripe update link...
				</React.Fragment>
			</BasePage>
		)
	}
}