import React from 'react';

import { Col, Row } from 'react-bootstrap';
import { RouteComponentProps } from 'react-router';

import BasePage from './elements/BasePage';

import { PageProps } from '../utils';

import './SupportView.css';

export interface SupportViewProps extends RouteComponentProps, PageProps { }

export class SupportView extends React.Component<SupportViewProps> {
	render() {
		return (
			<BasePage {...this.props}>
				<React.Fragment>
					<Row>
						<Col>
							<h2>Contact us.</h2>
						</Col>
					</Row>

					<Row>
						<Col>
							<p>
								If it is necessary to contact us, for a technical issue or just answering some questions, please contact us using our email:
							</p>
							<p>
								<a href="mailto:nouvique.site@gmail.com">nouvique.site@gmail.com</a>
							</p>
						</Col>
					</Row>
				</React.Fragment>
			</BasePage>
		)
	}
}