import React from 'react';

import { Result } from 'neverthrow';
import { Row } from 'react-bootstrap';
import { RouteComponentProps } from 'react-router';

import { ApiTest, apiTestLink, PageProps, resolveGETCall } from '../utils';

import BasePage from './elements/BasePage';

import './ItemView.css';

interface MatchParams {
	item_id: string
}

export interface ItemViewProps extends RouteComponentProps<MatchParams>, PageProps { }

interface State {
	apiValue: ApiTest
}

export class ItemView extends React.Component<ItemViewProps, State> {
	constructor(props: ItemViewProps) {
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
						<h1>
							Item: {this.props.match.params.item_id}
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