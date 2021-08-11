import React from 'react';

import { Result } from 'neverthrow';
import { RouteComponentProps } from 'react-router';

import BasePage from './elements/BasePage';

import { UserStripeOnboardingLinkREST, resolveGETCall, PageProps, userStripeOnboardingLinkRESTLink } from '../utils';

import './RefreshOnboardingStripeView.css';

interface MatchParams {
	username: string
}

export interface RefreshOnboardingStripeViewProps extends RouteComponentProps<MatchParams>, PageProps { }

export class RefreshOnboardingStripeView extends React.Component<RefreshOnboardingStripeViewProps> {
	async componentDidMount() {
		const pathStripeOnboardingLink: string = userStripeOnboardingLinkRESTLink + this.props.match.params.username + '/';
		const resultStripeOnboardingLink: Result<UserStripeOnboardingLinkREST, Error> = await resolveGETCall<UserStripeOnboardingLinkREST>(pathStripeOnboardingLink, true);

		resultStripeOnboardingLink
			.map(res => {
				window.location.href = res.onboarding_link;

				return null; // necessary to silence warning
			})
			.mapErr(err => {
				// cannot be authenticated with the user therefore, jwt tokens must not be correct, therefore, deny form access
				console.error(err);

				this.props.updateAlertBar("User is not valid to access their Stripe account. Please re-log-in and try again", "danger", true);

				this.props.history.push('/');
			});
	}

	render() {
		return (
			<BasePage {...this.props}>
				<React.Fragment>
					Attempting to refresh Stripe onboarding link...
				</React.Fragment>
			</BasePage>
		)
	}
}