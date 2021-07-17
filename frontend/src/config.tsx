interface Config {
	apiURL: string
}

const dev: Config = {
	apiURL: "http://localhost:8000/api"
}

const prod: Config = {
	apiURL: "/api"
};

const config: Config = process.env.REACT_APP_CONFIG === 'dev' ?
	dev : prod;

export default config;