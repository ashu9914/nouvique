import React from 'react';

import { RouteComponentProps } from 'react-router';
import { Row } from 'react-bootstrap';

import BasePage from './elements/BasePage';

import { PageProps } from '../utils';

import './EthicsView.css';

export interface EthicsViewProps extends RouteComponentProps, PageProps { }

export class EthicsView extends React.Component<EthicsViewProps> {
	render() {
		return (
			<BasePage {...this.props}>
				<React.Fragment>
					<Row>
						<h2 className="subtitle">
							Connecting you to your community through art.<br></br>
							Local arists using sutainable methods, curated by us.
						</h2>
					</Row>
				</React.Fragment>
			</BasePage>
		)
	}
}