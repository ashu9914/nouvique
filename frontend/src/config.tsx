interface Config {
	apiURL: string,
	stripePublishableKey: string
}

const dev: Config = {
	apiURL: "http://localhost:8000/api",
	stripePublishableKey: "pk_test_51JL4S9JAHFg3rfUP8rM3lpuwMCB7Shlwadg2RZqvdDTW6rkZoGw5ZQ73SqEqV0HPsCeXsneuY6PFSg5dnACRMSg100TgiyoQB4"
}

const prod: Config = {
	apiURL: "/api",
	stripePublishableKey: "pk_live_51JL4S9JAHFg3rfUPsNQDXKevPGnFpCOvEF0yGrxcHYRyRWZRBjGqjRMfKZHKAbl1sOAqpJMOeCF3fPJbCzgg9ZZn00DGsfbzjO"
};

const config: Config = process.env.REACT_APP_CONFIG === 'dev' ?
	dev : prod;

export default config;