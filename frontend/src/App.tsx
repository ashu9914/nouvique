import React from 'react';

import { Result } from 'neverthrow';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';

import { HomeView } from './components/HomeView';
import { LoginView } from './components/LoginView';
import { MediaListView } from './components/MediaListView';
import { MediaView } from './components/MediaView';
import { ProfileView } from './components/ProfileView';
import { CheckoutView } from './components/CheckoutView';
import { RefreshOnboardingStripeView } from './components/RefreshOnboardingStripeView';
import { RefreshUpdateStripeView } from './components/RefreshUpdateStripeView';
import { VerifyProfileView } from './components/VerifyProfileView';

import { AlertBarUpdater, BasketItem, ItemREST, ItemTypeAvailableREST, itemTypeAvailableRESTLink, ItemTypeREST, PageProps, resolveGETCall, Tokens } from './utils';
import config from './config';

import './App.css';

interface Props { }

interface State extends PageProps { }

const stripePromise = loadStripe(config.stripePublishableKey);

export default class App extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
			"alert": {
				"show": false,
				"message": "No alert text",
				"variant": "success"
			},
			"updateAlertBar": this.updateAlertBar,
			"emptyBasket": this.emptyBasket,
			"addToBasket": this.addToBasket,
			"checkBasketAvailabilities": this.checkBasketAvailabilities,
			"removeFromBasket": this.removeFromBasket,
			"getBasketItems": this.getBasketItems,
			"stripePromise": stripePromise,
			"getTotalBasketPrice": this.getTotalBasketPrice
		}
	}

	componentDidMount() {
		if (localStorage.getItem("tokens") === null) {
			const tokens: Tokens = {
				"access": "",
				"refresh": ""
			}

			localStorage.setItem("tokens", JSON.stringify(tokens));
		}

		if (localStorage.getItem("username") === null) {
			localStorage.setItem("username", "");
		}

		if (localStorage.getItem("basket") === null) {
			this.emptyBasket();
		} else {
			this.checkBasketAvailabilities();
		}
	}

	emptyBasket = () => {
		localStorage.setItem("basket", JSON.stringify([]));
	}

	addToBasket = (item: ItemREST, itemType: ItemTypeREST) => {
		const addingItem: BasketItem = {
			price: itemType.price,
			size: itemType.size,
			name: item.name,
			seller_name: item.seller_name,
			shape: item.shape,
			colour: item.colour,
			type_id: itemType.id,
			quantity: itemType.quantity,
			available: itemType.available
		}

		var currentBasket: BasketItem[] = this.getBasketItems();

		var updated: boolean = false;
		for (var i = 0; i < currentBasket.length; ++i) {
			if (currentBasket[i].type_id === itemType.id) {
				currentBasket[i].quantity += itemType.quantity;

				updated = true;
			}
		}

		if (!updated) currentBasket.push(addingItem);

		localStorage.setItem("basket", JSON.stringify(currentBasket));
	}

	removeFromBasket = (index: number) => {
		var currentBasket: BasketItem[] = this.getBasketItems();

		currentBasket.splice(index, 1);

		localStorage.setItem("basket", JSON.stringify(currentBasket));
	}

	checkBasketAvailabilities = async () => {
		var currentBasket: BasketItem[] = this.getBasketItems();

		for (var i: number = 0; i < currentBasket.length; ++i) {
			const index: number = i;
			const path: string = itemTypeAvailableRESTLink + currentBasket[i].type_id + '/';

			const result: Result<ItemTypeAvailableREST, Error> = await resolveGETCall<ItemTypeAvailableREST>(path);

			result
				.map(res => {
					currentBasket[index].available = res.available;

					return null;
				})
				.mapErr(err => {
					// unknown where or not its available or not, presume not as prevent errors occuring later
					currentBasket[index].available = false;
				})
		}

		localStorage.setItem("basket", JSON.stringify(currentBasket));
	}

	getBasketItems = (): BasketItem[] => {
		const currentBasket: BasketItem[] = JSON.parse(localStorage["basket"]);
		return currentBasket;
	}

	getTotalBasketPrice = (): number => {
		const currentBasket: BasketItem[] = this.getBasketItems();

		var total = 0;
		for (var i: number = 0; i < currentBasket.length; ++i) {
			total += currentBasket[i].price * currentBasket[i].quantity;
		}

		return total;
	}

	updateAlertBar = async (message: string, variant: string, show: boolean) => {
		const updater: AlertBarUpdater = {
			"message": message,
			"variant": variant,
			"show": show
		};
		this.setState({ "alert": updater });
	}

	render() {
		return (
			<React.Fragment>
				<Router>
					<Switch>
						<Route exact path="/" render={(props) => <HomeView {...props} {...this.state} />} />
						<Route exact path="/login" render={(props) => <LoginView {...props} {...this.state} />} />
						<Route exact path="/media/" render={(props) => <MediaListView {...props} {...this.state} />} />
						<Route exact path="/media/:media_id" render={(props) => <MediaView key={Date.now()} {...props} {...this.state} />} />

						<Route path="/profile/:username" render={(props) => <ProfileView key={Date.now()} {...props} {...this.state} />} />
						<Route path="/refresh_stripe_update_link/:username" render={(props) => <RefreshUpdateStripeView {...props} {...this.state} />} />
						<Route path="/refresh_stripe_onboarding_link/:username" render={(props) => <RefreshOnboardingStripeView {...props} {...this.state} />} />
						<Route path="/verify_profile/:username/:account_id" render={(props) => <VerifyProfileView {...props} {...this.state} />} />

						<Route path="/checkout" render={(props) => <CheckoutView {...props} {...this.state} />} />
					</Switch>
				</Router>
			</React.Fragment>
		);
	}
}