/* eslint-disable semi */
import { AffinityWallet as Wallet } from '@affinidi/wallet-expo-sdk'

const { EXPO_PASSWORD } = process.env
const { EXPO_ENCRYPTED_SEED } = process.env
const { EXPO_ACCESS_API_KEY } = process.env

const options = {
	env: 'staging',
	accessApiKey: EXPO_ACCESS_API_KEY,
};

const wallet = new Wallet(EXPO_PASSWORD, EXPO_ENCRYPTED_SEED, options);

export default class SDKService {
	static async getOfferResponseToken(token) {
		console.log('sdkService # getOfferResponseToken')

		try {
			return wallet.createCredentialOfferResponseToken(token)
		} catch (error) {
			if (error.response) console.log(error.response.data);
			else if (error.request) console.log(error.request);
			else console.log(error.message);

			return false
		}
	}

	static async createPresentationFromChallenge(token, vc) {
		console.log('sdkService # createPresentationFromChallenge')

		try {
			return wallet.createPresentationFromChallenge(token, [vc], 'domain')
		} catch (error) {
			if (error.response) console.log(error.response.data);
			else if (error.request) console.log(error.request);
			else console.log(error.message);

			return false
		}
	}

	static async saveCredentials(data) {
		console.log('sdkService # saveCredentials')

		try {
			return wallet.saveCredentials(data)
		} catch (error) {
			if (error.response) console.log(error.response.data);
			else if (error.request) console.log(error.request);
			else console.log(error.message);

			return false
		}
	}

	static async getCredentials(token) {
		console.log('sdkService # getCredentials')

		try {
			return wallet.getCredentials(token)
		} catch (error) {
			if (error.response) console.log(error.response.data);
			else if (error.request) console.log(error.request);
			else console.log(error.message);

			return false
		}
	}
}
