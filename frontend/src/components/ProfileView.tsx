import React from 'react';

import { FaCheck, FaTimes, FaSpinner } from 'react-icons/fa';
import { Result } from 'neverthrow';
import { Button, Col, Form, InputGroup, Row } from 'react-bootstrap';
import { RouteComponentProps } from 'react-router';

import { UserRESTSubmit, UserREST, UserRESTKeys, Tokens, PageProps, resolveGETCall, resolvePUTCall } from '../utils';

import BasePage from './elements/BasePage';

import './ProfileView.css';

interface MatchParams {
	username: string
}

interface Props extends RouteComponentProps<MatchParams>, PageProps { }

interface State {
	user: UserREST,
	form: UserRESTSubmit,
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
				email: "",
				location_town: "",
				location_country: "",
				location_postcode: "",
				bio: ""
			},
			form: {
				first_name: "",
				last_name: "",
				email: "",
				location_town: "",
				location_country: "",
				location_postcode: "",
				bio: ""
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
		var index: UserRESTKeys;
		if (id === "email") {
			index = "email";
		} else if (id === "first_name") {
			index = "first_name";
		} else if (id === "last_name") {
			index = "last_name";
		} else if (id === "location_town") {
			index = "location_town";
		} else if (id === "location_country") {
			index = "location_country";
		} else if (id === "location_postcode") {
			index = "location_postcode";
		} else { // id === bio
			index = "bio";
		}

		const cp: UserRESTSubmit = this.state.form;
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

		this.props.history.go(0);
	}

	getFormVariant = (field: UserRESTKeys): string => {
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

	getFormIcon = (field: UserRESTKeys): JSX.Element => {
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
							<Form onSubmit={this.handleFormSubmit}>
								<Form.Label>Bio</Form.Label>
								<InputGroup className="mb-3">
									<Form.Control
										required
										type="text"
										as="textarea"
										id="bio"
										value={this.state.form.bio}
										onChange={this.handleFormChange} />
									<Button variant={this.getFormVariant("bio")} disabled>
										{this.getFormIcon("bio")}
									</Button>
								</InputGroup>
							</Form>
							:
							<div>
								{this.state.user.bio}
							</div>
						}
					</Row>

					<Row>
						{this.state.isUser ?
							<Form onSubmit={this.handleFormSubmit}>
								<Form.Label>Email</Form.Label>
								<InputGroup className="mb-3">
									<Form.Control
										required
										type="email"
										id="email"
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

					<Row>
						<Col>
							{this.state.isUser ?
								<Form onSubmit={this.handleFormSubmit}>
									<Form.Label>Town/City</Form.Label>
									<InputGroup className="mb-3">
										<Form.Control
											required
											type="text"
											id="location_town"
											value={this.state.form.location_town}
											onChange={this.handleFormChange} />
										<Button variant={this.getFormVariant("location_town")} disabled>
											{this.getFormIcon("location_town")}
										</Button>
									</InputGroup>
								</Form>
								:
								<div>
									{this.state.user.location_town}
								</div>
							}
						</Col>
						<Col>
							{this.state.isUser ?
								<Form onSubmit={this.handleFormSubmit}>
									<Form.Label>Country</Form.Label>
									<InputGroup className="mb-3">
										<Form.Control
											required
											type="text"
											id="location_country"
											value={this.state.form.location_country}
											onChange={this.handleFormChange} />
										<Button variant={this.getFormVariant("location_country")} disabled>
											{this.getFormIcon("location_country")}
										</Button>
									</InputGroup>
								</Form>
								:
								<div>
									{this.state.user.location_country}
								</div>
							}
						</Col>
					</Row>



					{this.state.isUser &&
						<React.Fragment>
							<Row>
								<Form onSubmit={this.handleFormSubmit}>
									<Form.Label>Postcode</Form.Label>
									<InputGroup className="mb-3">
										<Form.Control
											required
											type="text"
											id="location_postcode"
											value={this.state.form.location_postcode}
											onChange={this.handleFormChange} />
										<Button variant={this.getFormVariant("location_postcode")} disabled>
											{this.getFormIcon("location_postcode")}
										</Button>
									</InputGroup>
								</Form>
							</Row>

							<Row>
								<Form onSubmit={this.handleFormSubmit}>
									<Form.Label>First Name</Form.Label>
									<InputGroup className="mb-3">
										<Form.Control
											required
											type="text"
											id="first_name"
											value={this.state.form.first_name}
											onChange={this.handleFormChange} />
										<Button variant={this.getFormVariant("first_name")} disabled>
											{this.getFormIcon("first_name")}
										</Button>
									</InputGroup>
								</Form>
							</Row>
							<Row>
								<Form onSubmit={this.handleFormSubmit}>
									<Form.Label>Last Name</Form.Label>
									<InputGroup className="mb-3">
										<Form.Control
											required
											type="text"
											id="last_name"
											value={this.state.form.last_name}
											onChange={this.handleFormChange} />
										<Button variant={this.getFormVariant("last_name")} disabled>
											{this.getFormIcon("last_name")}
										</Button>
									</InputGroup>
								</Form>
							</Row>
						</React.Fragment>
					}
				</BasePage>
			</React.Fragment >
		);
	}
}