import React from 'react';

import { Result } from 'neverthrow';
import { Row } from 'react-bootstrap';
import { Container } from 'react-bootstrap';
import { Col } from 'react-bootstrap';
import { RouteComponentProps } from 'react-router';

import { ApiTest, apiTestLink, PageProps, resolveGETCall } from '../utils';

import BasePage from './elements/BasePage';
import LoginForm from './elements/CredentialForm';

import './LoginView.css';

export interface LoginViewProps extends RouteComponentProps, PageProps { }

interface State {
	apiValue: ApiTest
}

export class LoginView extends React.Component<LoginViewProps, State> {
	constructor(props: LoginViewProps) {
		super(props);

		this.state = {
			apiValue: {
				blah: ""
			}
		};
	}

	async componentDidMount() {
		const result: Result<ApiTest, Error> = await resolveGETCall<ApiTest>(apiTestLink);

		result
			.map(res => {
				this.setState({ apiValue: res });

				return null; // necessary to silence warning
			})
			.mapErr(err => {
				console.error(err);
			});
	}

	render() {
		return (
			<React.Fragment>
				<BasePage {...this.props}>


					<Container>
						<Row>

							<Col></Col>

							<Col xs={6}>
								<Row>
									<h1 className="title">
										login
									</h1>
								</Row>

								<Row>
									<div>
										{this.state.apiValue.blah}
									</div>
								</Row>

								<Row>
									<LoginForm {...this.props} />
								</Row>
							</Col>

							<Col></Col>

						</Row>


					</Container>

				</BasePage>
			</React.Fragment>
		);
	}
}