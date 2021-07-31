import React from 'react';

import { Result } from 'neverthrow';
import { Row } from 'react-bootstrap';
import { RouteComponentProps } from 'react-router';

import { PageProps, resolveGETCall } from '../utils';

import BasePage from './elements/BasePage';

import './MediaListView.css';

interface ApiTest {
	blah: string
}

interface Props extends RouteComponentProps, PageProps { }

interface State {
	apiValue: ApiTest
}

export default class MediaListView extends React.Component<Props, State> {
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
						<h1 className="title" >
							browse
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