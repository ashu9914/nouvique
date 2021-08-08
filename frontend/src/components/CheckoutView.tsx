import React from 'react';

import { RouteComponentProps } from 'react-router';
import { Button, Col, Row } from 'react-bootstrap';
import { FaTimes } from 'react-icons/fa';
import { Elements } from '@stripe/react-stripe-js';

import { BasketItem, getActualPriceString, PageProps } from '../utils';

import BasePage from './elements/BasePage';
import InjectedCheckoutForm from './elements/NouviqueStripeCheckoutForm';

import './CheckoutView.css';

interface Props extends RouteComponentProps, PageProps { }

interface State {
	basketItems: BasketItem[],
	totalValue: number
}

export default class CheckoutView extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
			basketItems: [],
			totalValue: 0
		};
	}

	componentDidMount() {
		this.retrieveBasket();
		this.setState((_dummy, props) => (
			{ totalValue: props.getTotalBasketPrice() }
		));
	}

	retrieveBasket = () => {
		this.setState((_dummy, props) => (
			{ basketItems: props.getBasketItems() }
		));
	}

	removeFromBothBaskets = (index: number) => {
		this.props.removeFromBasket(index);
		this.retrieveBasket();
		this.setState((_dummy, props) => (
			{ totalValue: props.getTotalBasketPrice() }
		));
	}

	render() {
		return (
			<React.Fragment>
				<BasePage {...this.props}>
					<Row>
						<Col>
							<h1>
								Checkout
							</h1>
						</Col>
					</Row>
					<div>
						{this.state.basketItems.map((item, i) => {
							return (
								<React.Fragment key={item.type_id}>
									<div className="bottom-border">
										<Row>
											<Col>
												<Row>
													<Col>
														<h3>
															{item.name}
														</h3>
													</Col>
													<Col>
														<Button onClick={() => { this.removeFromBothBaskets(i) }} variant='outline-danger' style={{ float: 'right' }}>
															<FaTimes />
														</Button>
													</Col>
												</Row>
												<Row>
													<Col>
														{item.size}
													</Col>

												</Row>
												<Row>
													<Col>
														{item.colour}
													</Col>
												</Row>
												<Row>
													<Col>
														{item.quantity}
													</Col>
													<Col>
														<span style={{ float: 'right' }}>
															{item.quantity} x £{item.price}: £{getActualPriceString(item.price, item.quantity)}
														</span>
													</Col>
												</Row>
											</Col>
										</Row>
									</div>
								</React.Fragment>
							);
						}
						)
						}
					</div>
					<div style={{ borderTop: '1px dashed grey' }}>
						<Row>
							<Col>
								<span>
									Total
							</span>
							</Col>
							<Col>
								<span style={{ float: 'right' }}>
									£{getActualPriceString(this.state.totalValue, 1)}
								</span>
							</Col>
						</Row>
					</div>

					<Elements stripe={this.props.stripePromise}>
						<InjectedCheckoutForm {...this.props} {...this.state} />
					</Elements>
				</BasePage>
			</React.Fragment>
		);
	}
}