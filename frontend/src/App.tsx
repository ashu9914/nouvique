import React from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';

import HomeView from './components/HomeView';
import LoginView from './components/LoginView';
import MediaListView from './components/MediaListView';
import MediaView from './components/MediaView';
import ProfileView from './components/ProfileView';

import { AlertBarUpdater, PageProps, Tokens } from './utils';

import './App.css';

interface Props { }

interface State extends PageProps { }

export default class App extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);

		// this.updateAlertBar = this.updateAlertBar.bind(this);

		this.state = {
			"alert": {
				"show": false,
				"message": "No alert text",
				"variant": "success"
			},
			"updateAlertBar": this.updateAlertBar
		}
	}

	componentDidMount() {
		if (localStorage.getItem("tokens") === null) {
			const tokens: Tokens = {
				"access": "",
				"refresh": ""
			}

			localStorage.setItem("tokens", JSON.stringify(tokens));
		}

		if (localStorage.getItem("username") === null) {
			localStorage.setItem("username", "");
		}
	}

	updateAlertBar = async (message: string, variant: string, show: boolean) => {
		const updater: AlertBarUpdater = {
			"message": message,
			"variant": variant,
			"show": show
		};
		this.setState({ "alert": updater });
	}

	render() {
		return (
			<React.Fragment>
				<Router>
					<Switch>
						<Route exact path="/" render={(props) => <HomeView {...props} {...this.state} updateAlertBar={this.updateAlertBar} />} />
						<Route exact path="/login" render={(props) => <LoginView {...props} {...this.state} updateAlertBar={this.updateAlertBar} />} />
						<Route exact path="/media/" render={(props) => <MediaListView {...props} {...this.state} updateAlertBar={this.updateAlertBar} />} />
						<Route path="/media/:media_id" render={(props) => <MediaView {...props} {...this.state} updateAlertBar={this.updateAlertBar} />} />
						<Route path="/profile/:username" render={(props) => <ProfileView {...props} {...this.state} updateAlertBar={this.updateAlertBar} />} />
					</Switch>
				</Router>
			</React.Fragment>
		);
	}
}