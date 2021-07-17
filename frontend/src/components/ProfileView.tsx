import React from 'react';

import { FaCheck, FaSpinner } from 'react-icons/fa';
import { Result } from 'neverthrow';
import { Button, Col, Form, InputGroup, Row } from 'react-bootstrap';
import { RouteComponentProps } from 'react-router';

import { UserRESTSubmit, UserREST, Tokens, PageProps, resolveGETCall, resolvePUTCall } from '../utils';

import BasePage from './elements/BasePage';

import './ProfileView.css';

interface MatchParams {
	username: string
}

interface Props extends RouteComponentProps<MatchParams>, PageProps { }

interface State {
	user: UserREST,
	form: UserREST,
	isUser: boolean
}

export default class ProfileView extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
			user: {
				first_name: "",
				last_name: "",
				email: ""
			},
			form: {
				first_name: "",
				last_name: "",
				email: ""
			},
			isUser: localStorage.getItem("username") === this.props.match.params.username
		};
	}

	async componentDidMount() {
		const path: string = '/getuser/' + this.props.match.params.username + '/';
		const result: Result<UserREST, Error> = await resolveGETCall<UserREST>(path);

		result
			.map(res => {
				this.setState({ user: Object.assign({}, res), form: Object.assign({}, res) });

				return null; // necessary to silence warning
			})
			.mapErr(err => {
				console.error(err);
			});
	}

	handleChangeSubmit = async () => {
		const path = '/user/' + this.props.match.params.username + '/';

		const result: Result<UserREST, Error> = await resolvePUTCall<UserREST, UserRESTSubmit>(path, this.state.form, true);

		result
			.map(res => {
				// TODO: replace with inline submition icon
				// this.props.updateAlertBar("Successfully logged in!", "success", true);

				// this.props.history.push('/profile/' + res.username);

				this.setState({ user: Object.assign({}, res), form: Object.assign({}, res) });

				return null; // necessary to silence warning
			})
			.mapErr(err => {
				const message: string = "Could not complete request, please try logging out and back in";

				this.props.updateAlertBar(message, "danger", true);
			});
	}

	handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		this.handleChangeSubmit();
	}

	handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const cp: UserREST = this.state.form;
		cp.email = event.target.value;
		this.setState({ form: cp });
		this.handleChangeSubmit();
	}

	handleLogOut = async () => {
		localStorage.setItem("username", "");

		const tokens: Tokens = {
			"access": "",
			"refresh": ""
		};
		localStorage.setItem("tokens", JSON.stringify(tokens));

		window.location.reload();
	}

	render() {
		return (
			<React.Fragment>
				<BasePage {...this.props}>
					<Row>
						<Col>
							<h1>
								{this.state.user.first_name} {this.state.user.last_name}'s Profile
							</h1>
						</Col>
						{this.state.isUser &&
							<Col>
								<Button onClick={this.handleLogOut} variant='outline-danger' style={{ float: "right" }}>
									Log out
								</Button>
							</Col>
						}
					</Row>

					<Row>
						<div>
							@{this.props.match.params.username}
						</div>
					</Row>

					<Row>
						{this.state.isUser ?
							<Form onSubmit={this.handleChangeSubmit}>
								<Form.Label>Email</Form.Label>
								<InputGroup className="mb-3" id="email">
									<Form.Control
										required
										type="text"
										value={this.state.form.email}
										onChange={this.handleEmailChange} />
									<Button variant={this.state.form.email === this.state.user.email ? "outline-success" : "outline-warning"} disabled>
										{this.state.form.email === this.state.user.email ?
											<FaCheck />
											:
											<FaSpinner className="spinner" />
										}
									</Button>
								</InputGroup>
							</Form>
							:
							<div>
								{this.state.user.email}
							</div>
						}
					</Row>
				</BasePage>
			</React.Fragment >
		);
	}
}