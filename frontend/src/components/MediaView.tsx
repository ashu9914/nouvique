import React from 'react';

import { Result } from 'neverthrow';
import { Row } from 'react-bootstrap';
import { RouteComponentProps } from 'react-router';

import { PageProps, resolveGETCall } from '../utils';

import BasePage from './elements/BasePage';

import './MediaView.css';

interface ApiTest {
	blah: string
}

interface MatchParams {
	media_id: string
}

interface Props extends RouteComponentProps<MatchParams>, PageProps { }

interface State {
	apiValue: ApiTest
}

export default class MediaView extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
			apiValue: {
				blah: ""
			}
		};
	}

	async componentDidMount() {
		const result: Result<ApiTest, Error> = await resolveGETCall<ApiTest>('/');

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
						<h1>
							Media: {this.props.match.params.media_id}
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