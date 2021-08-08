import * as React from 'react';

import { mount, shallow } from 'enzyme';

import { ProfileView, ProfileViewProps } from './ProfileView';
import { MemoryRouter as Router } from 'react-router';

describe('ProfileView', () => {
	const getProps = (): ProfileViewProps => (
		{
			history: {} as any,
			location: {} as any,
			match: { params: { username: "foo" } as any } as any,
			updateAlertBar: {} as any,
			emptyBasket: {} as any,
			addToBasket: {} as any,
			removeFromBasket: {} as any,
			getBasketItems: {} as any,
			getTotalBasketPrice: {} as any,
			checkBasketAvailabilities: {} as any,
			stripePromise: {} as any,
			alert: {} as any
		}
	)

	const getComponent = (props: ProfileViewProps) => (
		<ProfileView {...props} />
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