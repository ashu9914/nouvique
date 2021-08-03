import React from 'react';

import { Result } from 'neverthrow';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { RouteComponentProps } from 'react-router';

import { TokenREST, RegistrationRESTSubmit, resolvePOSTCall, PageProps } from '../../utils';

import './CredentialForm.css';

interface Props extends RouteComponentProps, PageProps { }

interface State extends RegistrationRESTSubmit {
	register: boolean
}

export default class LoginForm extends React.PureComponent<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
			username: "",
			password: "",
			register: false,
			first_name: "",
			last_name: "",
			email: "",
			location_town: "",
			location_country: "",
			location_postcode: ""
		};
	}

	handlSubmitLogin = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const data: RegistrationRESTSubmit = {
			username: this.state.username,
			password: this.state.password,
			first_name: this.state.first_name,
			last_name: this.state.last_name,
			email: this.state.email,
			location_town: this.state.location_town,
			location_country: this.state.location_country,
			location_postcode: this.state.location_postcode
		};

		const path = this.state.register ? '/auth/register/' : '/auth/login/';

		const result: Result<TokenREST, Error> = await resolvePOSTCall<TokenREST, RegistrationRESTSubmit>(path, data);

		result
			.map(res => {
				localStorage.setItem("tokens", JSON.stringify(res.tokens));
				localStorage.setItem("username", res.username);

				this.props.updateAlertBar("Successfully logged in!", "success", true);

				this.props.history.push('/profile/' + res.username);

				return null; // necessary to silence warning
			})
			.mapErr(err => {
				const message: string = this.state.register ?
					"Username is already taken, please try again with a new username"
					:
					"Please make sure that the credentials you have provided are correct";

				this.props.updateAlertBar(message, "danger", true);
			});
	}

	render() {
		return (
			<React.Fragment>
				<Form onSubmit={this.handlSubmitLogin}>
					<Form.Group className="mb-3" controlId="username">
						<Form.Label>Username</Form.Label>
						<Form.Control
							required
							type="text"
							placeholder="Username"
							value={this.state.username}
							onChange={async (event: React.ChangeEvent<HTMLInputElement>) => { this.setState({ username: event.target.value }) }} />
					</Form.Group>

					<Form.Group className="mb-3" controlId="password">
						<Form.Label>Password</Form.Label>
						<Form.Control
							required
							type="password"
							placeholder="Password"
							value={this.state.password}
							onChange={async (event: React.ChangeEvent<HTMLInputElement>) => { this.setState({ password: event.target.value }) }} />
					</Form.Group>

					{this.state.register &&
						<React.Fragment>
							<Form.Group className="mb-3" controlId="first_name">
								<Form.Label>First Name</Form.Label>
								<Form.Control
									required
									type="text"
									placeholder="John"
									value={this.state.first_name}
									onChange={async (event: React.ChangeEvent<HTMLInputElement>) => { this.setState({ first_name: event.target.value }) }} />
							</Form.Group>

							<Form.Group className="mb-3" controlId="last_name">
								<Form.Label>Last Name</Form.Label>
								<Form.Control
									required
									type="text"
									placeholder="Smith"
									value={this.state.last_name}
									onChange={async (event: React.ChangeEvent<HTMLInputElement>) => { this.setState({ last_name: event.target.value }) }} />
							</Form.Group>

							<Form.Group className="mb-3" controlId="email">
								<Form.Label>Email</Form.Label>
								<Form.Control
									required
									type="email"
									placeholder="example@email.com"
									value={this.state.email}
									onChange={async (event: React.ChangeEvent<HTMLInputElement>) => { this.setState({ email: event.target.value }) }} />
							</Form.Group>

							<Form.Group className="mb-3" controlId="location_town">
								<Form.Label>Town/City</Form.Label>
								<Form.Control
									required
									type="text"
									placeholder="Birmingham"
									value={this.state.location_town}
									onChange={async (event: React.ChangeEvent<HTMLInputElement>) => { this.setState({ location_town: event.target.value }) }} />
							</Form.Group>

							<Form.Group className="mb-3" controlId="location_country">
								<Form.Label>Country</Form.Label>
								<Form.Control
									required
									type="text"
									placeholder="United Kingdom"
									value={this.state.location_country}
									onChange={async (event: React.ChangeEvent<HTMLInputElement>) => { this.setState({ location_country: event.target.value }) }} />
							</Form.Group>

							<Form.Group className="mb-3" controlId="location_postcode">
								<Form.Label>Postcode</Form.Label>
								<Form.Control
									required
									type="text"
									placeholder="L12 7HJ"
									value={this.state.location_postcode}
									onChange={async (event: React.ChangeEvent<HTMLInputElement>) => { this.setState({ location_postcode: event.target.value }) }} />
							</Form.Group>
						</React.Fragment>
					}

					<Row>
						<Col>
							<Button className="button" variant="outline-dark" type="submit">
								{this.state.register ? "Register" : "Log in"}
							</Button>
						</Col>
						<Col>
							<Button className="button" onClick={() => this.setState(prev => ({ register: !prev.register }))} variant="outline-dark" style={{ float: "right" }}>
								{this.state.register ? "Already registered?" : "Not signed up?"}
							</Button>
						</Col>
					</Row>
				</Form>
			</React.Fragment>
		);
	}
}