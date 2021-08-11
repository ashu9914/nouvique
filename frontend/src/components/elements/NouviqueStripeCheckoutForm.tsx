import React from 'react';

import { Result } from 'neverthrow';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { FaSpinner } from 'react-icons/fa';
import { RouteComponentProps } from 'react-router-dom';
import { CardElement, ElementsConsumer } from '@stripe/react-stripe-js';
import { Stripe, StripeElements } from '@stripe/stripe-js';

import { PageProps, resolvePOSTCall, stripePaymentIntentRESTLink, StripePaymentIntentRESTSubmit, StripePaymentIntentREST, BasketItem, StripeUndoPaymentIntentREST, stripeUndoPaymentIntentRESTLink, StripeUndoPaymentIntentRESTSubmit } from '../../utils';

import './NouviqueStripeCheckoutForm.css';

const CARD_OPTIONS = {
	iconStyle: 'solid' as const,
	style: {
		base: {
			iconColor: '#6772e5',
			color: '#6772e5',
			fontWeight: '500',
			fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
			fontSize: '16px',
			fontSmoothing: 'antialiased',
			':-webkit-autofill': {
				color: '#fce883',
			},
			'::placeholder': {
				color: '#6772e5',
			},
		},
		invalid: {
			iconColor: '#ef2961',
			color: '#ef2961',
		},
	},
};

interface InjectedProps extends PageProps, RouteComponentProps {
	totalValue: number
}

interface Props extends InjectedProps {
	stripe: Stripe | null,
	elements: StripeElements | null
}
interface State {
	cardHolder: string,
	processingPayment: boolean
}

class NouviqueStripeCheckoutForm extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
			cardHolder: "",
			processingPayment: false
		};
	}

	handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		// Block native form submission.
		event.preventDefault();

		this.props.updateAlertBar("Processing payment, please do not navigate away from this page...", "warning", true);
		this.setState({ processingPayment: true });

		if (!this.props.stripe || !this.props.elements) return;
		if (!event.currentTarget.reportValidity()) return;

		const data: StripePaymentIntentRESTSubmit = {
			amount: this.props.totalValue,
			item_types: this.props.getBasketItems(),
			buyer_name: localStorage["username"]
		};
		const response: Result<StripePaymentIntentREST, Error> = await resolvePOSTCall<StripePaymentIntentREST, StripePaymentIntentRESTSubmit>(stripePaymentIntentRESTLink, data, true);

		response
			.map(async res => {
				var errorOccured: boolean = false;
				var erroredIndices: number[] = [];
				for (var i: number = 0; i < res.client_secrets.length; ++i) {
					const client_secret: string = res.client_secrets[i];

					const cardElement = this.props.elements!.getElement(CardElement);
					const { error, paymentIntent } = await this.props.stripe!.confirmCardPayment(
						client_secret,
						{
							payment_method: {
								card: cardElement!,
								billing_details: { name: this.state.cardHolder },
							},
						}
					);

					if (error || paymentIntent === undefined || paymentIntent.status !== 'succeeded') {
						errorOccured = true;
						erroredIndices.push(i);
						break;
					}
				}

				if (errorOccured) {
					const erroredItems: string[] = erroredIndices
						.map((index, i) => {
							const data: StripeUndoPaymentIntentRESTSubmit = {
								client_secret: res.client_secrets[index],
								item_type: this.props.getBasketItems()[index],
								buyer_name: localStorage["username"]
							};

							// Do not use return value as we do not need any data returned
							resolvePOSTCall<StripeUndoPaymentIntentREST, StripeUndoPaymentIntentRESTSubmit>(stripeUndoPaymentIntentRESTLink, data, true);

							const item: BasketItem = this.props.getBasketItems()[index];
							const end: string = (i < (erroredIndices.length - 1)) ? ", " : "";
							return (item.name + "/" + item.shape + "x" + item.quantity + end);
						});
					this.props.updateAlertBar("Error processing payment for: " + [...erroredItems], "danger", true);
				} else {
					this.props.updateAlertBar("Payment successful", "success", true);
					this.props.history.push("/profile/" + localStorage["username"]);
				}
			})
			.mapErr(err => {
				this.props.updateAlertBar("Could not complete transaction. Please try re-logging in and trying again", "danger", true);
			});
	};

	render() {
		return (
			<React.Fragment>
				<div style={{ marginTop: '1rem' }}>
					<Form onSubmit={this.handleSubmit}>
						<InputGroup>
							<Form.Control
								required
								type="text"
								id="cardHolder"
								value={this.state.cardHolder}
								placeholder="Cardholder's name"
								onChange={(event) => { this.setState({ cardHolder: event.target.value }) }} />
						</InputGroup>
						<Form.Group>
							<CardElement options={CARD_OPTIONS} />
						</Form.Group>
						<Form.Group>
							<Button type="submit" disabled={!this.props.stripe || this.state.processingPayment} variant='outline-success' style={{ width: '100%' }}>
								{this.state.processingPayment ?
									<React.Fragment>
										<FaSpinner className="spinner" />
									</React.Fragment>
									:
									<React.Fragment>
										Pay
									</React.Fragment>
								}
							</Button>
						</Form.Group>
					</Form>
				</div>
			</React.Fragment >
		);
	}
};

const InjectedCheckoutForm: React.FC<InjectedProps> = (props: InjectedProps) => {
	return (
		<ElementsConsumer>
			{({ elements, stripe }) => (
				<NouviqueStripeCheckoutForm elements={elements} stripe={stripe} {...props} />
			)}
		</ElementsConsumer>
	);
};

export default InjectedCheckoutForm;