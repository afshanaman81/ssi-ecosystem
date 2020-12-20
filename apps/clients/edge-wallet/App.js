// eslint-disable-next-line no-unused-vars
import * as encoding from 'text-encoding';
import React from 'react';

import {
	StyleSheet, Image, Text, View,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import logo from './assets/logo.png';
import DBService from './services/dbService';

import Scanner from './components/BarcodeScanner';
import Credentials from './components/DisplayCredentials';
import Services from './components/DisplayServices';

const affinidiBlue = '#644791';
const Tab = createBottomTabNavigator();

// NOTE: (TODO:)
// In a non-demo app, the tables should not be dropped
DBService.dropTables();
DBService.createTables();

const styles = StyleSheet.create({
	contianer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	title: {
		fontSize: 24,
		fontWeight: '500',
	},
	logo: {
		width: 250,
		height: 60,
	},
});

function HomeScreen() {
	return (
		<View style={styles.contianer}>
			<Image style={styles.logo} source={logo} />
			<Text style={styles.title}>Wallet</Text>
		</View>
	);
}

function App() {
	return (
		<NavigationContainer>
			<Tab.Navigator
				screenOptions={({ route }) => ({
					tabBarIcon: ({ color, size }) => {
						let iconName;

						if (route.name === 'Home') {
							iconName = 'home';
						} else if (route.name === 'Scan') {
							iconName = 'qr-code';
						} else if (route.name === 'Credentials') {
							iconName = 'credit-card';
						} else if (route.name === 'Services') {
							iconName = 'local-offer';
						}
						return <MaterialIcons name={iconName} size={size} color={color} />;
					},
				})}
				tabBarOptions={{
					activeTintColor: affinidiBlue,
					inactiveTintColor: 'gray',
				}}
			>
				<Tab.Screen name="Home" component={HomeScreen} />
				<Tab.Screen name="Scan" component={Scanner} />
				<Tab.Screen name="Credentials" component={Credentials} options={{ unmountOnBlur: true }} />
				<Tab.Screen name="Services" component={Services} options={{ unmountOnBlur: true }} />
			</Tab.Navigator>
		</NavigationContainer>
	);
}

export default App;
