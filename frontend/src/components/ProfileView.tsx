import React from 'react';

import { FaCheck, FaTimes, FaSpinner } from 'react-icons/fa';
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
	isUser: boolean,
	submit_error: boolean
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
			submit_error: false,
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
				this.setState({ user: Object.assign({}, res), form: Object.assign({}, res) });

				return null; // necessary to silence warning
			})
			.mapErr(err => {
				const message: string = "Could not complete request, please try logging out and back in";

				this.setState({ submit_error: true });

				this.props.updateAlertBar(message, "danger", true);
			});
	}

	handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		this.handleChangeSubmit();
	}

	handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const id: string = event.target.id;
		var index: "email" | "first_name" | "last_name";
		if (id === "email") {
			index = "email";
		} else if (id === "first_name") {
			index = "first_name";
		} else { // id === last_name
			index = "last_name";
		}

		const cp: UserREST = this.state.form;
		cp[index] = event.target.value;
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

	getFormVariant = (field: "email" | "first_name" | "last_name"): string => {
		if (this.state.form[field] === this.state.user[field]) {
			return "outline-success";
		} else {
			if (this.state.submit_error) {
				return "outline-danger";
			} else {
				return "outline-warning";
			}
		}
	}

	getFormIcon = (field: "email" | "first_name" | "last_name"): JSX.Element => {
		if (this.state.form[field] === this.state.user[field]) {
			return <FaCheck />;
		} else {
			if (this.state.submit_error) {
				return <FaTimes />;
			} else {
				return <FaSpinner className="spinner" />;
			}
		}
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
								<InputGroup className="mb-3">
									<Form.Control
										required
										id="email"
										type="text"
										value={this.state.form.email}
										onChange={this.handleFormChange} />
									<Button variant={this.getFormVariant("email")} disabled>
										{this.getFormIcon("email")}
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