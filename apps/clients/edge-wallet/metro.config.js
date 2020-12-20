module.exports = {
	resolver: {
		resolverMainFields: ['react-native', 'browser', 'module', 'main'],
		extraNodeModules: {
			// Polyfills for node libraries
			mobileRandomBytes: require.resolve('@affinidi/wallet-expo-sdk/mobileRandomBytes'),
			crypto: require.resolve('@affinidi/wallet-expo-sdk/isNode'),
			stream: require.resolve('stream-browserify'),
		},
	},
};
