import React from 'react';

import { Result } from 'neverthrow';
import { Row } from 'react-bootstrap';
import { RouteComponentProps } from 'react-router';

import { ApiTest, apiTestLink, PageProps, resolveGETCall } from '../utils';

import BasePage from './elements/BasePage';

import './MediaListView.css';

export interface MediaListViewProps extends RouteComponentProps, PageProps { }

interface State {
	apiValue: ApiTest
}

export class MediaListView extends React.Component<MediaListViewProps, State> {
	constructor(props: MediaListViewProps) {
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