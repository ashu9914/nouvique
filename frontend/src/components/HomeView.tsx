import React from 'react';

import { Result } from 'neverthrow';
import { Row } from 'react-bootstrap';
import { Col } from 'react-bootstrap';
import { RouteComponentProps } from 'react-router';

import { ApiTest, apiTestLink, PageProps, resolveGETCall } from '../utils';

import BasePage from './elements/BasePage';

import './HomeView.css';

export interface HomeViewProps extends RouteComponentProps, PageProps { }

interface State {
	apiValue: ApiTest
}

export class HomeView extends React.Component<HomeViewProps, State> {
	constructor(props: HomeViewProps) {
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

					<Row>
						<h2 className="subtitle">
							Connecting you to your community through art.<br></br>
							Local arists using sutainable methods, curated by us.
						</h2>
					</Row>

					<Row className="content">

						<Col>
							<h1 className="title">
								featured artists
							</h1>
						</Col>

						<Col>
							<h1 className="title">
								featured pieces
							</h1>
						</Col>

						<h1>
							Home
						</h1>
					</Row>

					<Row>
						<div>
							{this.state.apiValue.blah}
						</div>
					</Row>

				</BasePage>
			</React.Fragment>
		);
	}
}