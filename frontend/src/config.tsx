const dev = {
	apiURL : "http://localhost:8000/api"
}

const prod = {
	apiURL : "/api"	
};

const config = process.env.REACT_APP_CONFIG === 'dev' ?
	dev : prod;

export default config;