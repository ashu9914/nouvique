import * as React from 'react';

import { mount, shallow } from 'enzyme';

import { CheckoutView, CheckoutViewProps } from './CheckoutView';
import { MemoryRouter as Router } from 'react-router';
import { loadStripe } from '@stripe/stripe-js';

describe('CheckoutView', () => {
	const getProps = (): CheckoutViewProps => (
		{
			history: {} as any,
			location: {} as any,
			match: {} as any,
			updateAlertBar: {} as any,
			emptyBasket: {} as any,
			addToBasket: {} as any,
			removeFromBasket: {} as any,
			getBasketItems: () => [],
			getTotalBasketPrice: () => 0,
			checkBasketAvailabilities: {} as any,
			stripePromise: loadStripe("foo") as any,
			alert: {} as any
		}
	)

	const getComponent = (props: CheckoutViewProps) => (
		<CheckoutView {...props} />
	);


	it('Should render correctly with shallow', () => {
		const component = shallow(
			getComponent(getProps())
		);
		expect(component.debug()).toMatchSnapshot();
	});

	it('Should render correctly with mount', () => {
		// have to include router as will fail with react-router problem due to use of specific functions
		const component = mount(
			<Router>
				{getComponent(getProps())}
			</Router>
		);
		expect(component.debug()).toMatchSnapshot();
	});
});