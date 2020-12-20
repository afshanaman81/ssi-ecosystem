/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-one-expression-per-line */
import React, { Component } from 'react';
import {
	StyleSheet, Text, View, ScrollView, Image, ToastAndroid, Alert, Platform,
} from 'react-native';
import Constants from 'expo-constants';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import DBService from '../services/dbService';
import logo from '../assets/icon.png';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginTop: Constants.statusBarHeight,
		justifyContent: 'center',
		alignItems: 'center',
	},
	title: {
		fontSize: 20,
		paddingTop: 10,
		fontWeight: '500',
		alignSelf: 'center',
	},
	cardContainer: {
		paddingTop: 15,
		paddingBottom: 15,
		marginTop: 20,
		width: 330,
		height: 160,
		shadowColor: 'rgba(0, 0, 0, 0.5)',
		shadowOffset: { x: 0, y: 10 },
		shadowOpacity: 1,
		borderLeftColor: 'grey',
		borderLeftWidth: 10,
		borderRadius: 10,
		alignSelf: 'stretch',
		backgroundColor: 'lightgrey',
	},
	cardContent: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginTop: 10,
		marginLeft: 50,
	},
	cardHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginLeft: 5,
		marginRight: 15,
	},
	cardFooter: {
		flex: 1,
		justifyContent: 'flex-end',
		minHeight: 18,
		marginTop: 25,
		marginLeft: 5,
		marginRight: 10,
		paddingLeft: 10,
		backgroundColor: 'grey',
	},
	smallFont: {
		fontStyle: 'italic',
		fontSize: 11,
	},
	contentFont: {
		fontSize: 12,
		fontWeight: 'bold',
	},
	logo: {
		width: 50,
		height: 40,
	},
});

const Card = ({
	date, title, desc, id,
}) => (
	<View style={styles.cardContainer}>

		<View style={styles.cardHeader}>
			<Image style={styles.logo} source={logo} />
			<Text style={styles.smallFont}>
				Date Issued: {date}
			</Text>
		</View>

		<View style={styles.cardContent}>
			<View style={{ flexDirection: 'column' }}>
				<Text style={styles.contentFont}>Id: {title}</Text>
				<Text style={styles.contentFont}>Type: {desc}</Text>
			</View>
			<MaterialIcons name="navigate-next" size={40} color="red" />
		</View>

		<View style={styles.cardFooter}>
			<Text style={styles.smallFont}>Row Id: {id}</Text>
		</View>
	</View>
);

export default class DisplayCredentials extends Component {
	constructor(props) {
		super(props);

		this.state = {
			credentials: [],
			title: 'Loading Credentials ...',
		};

		this.renderCards = this.renderCards.bind(this);
	}

	async componentDidMount() {
		console.log('DisplayCredentials # componentDidMount');
		await this.getResultsFromDB();

		const msg = 'All your Credentials will be displayed here';
		if (Platform.OS === 'android') {
			ToastAndroid.showWithGravity(msg, ToastAndroid.LONG, ToastAndroid.CENTER);
		} else {
			Alert.alert(msg);
		}
	}

	async getResultsFromDB() {
		console.log('DisplayCredentials # getResultsFromDB');
		const results = await DBService.getAllCredentials();

		if (results.length > 0) {
			this.setState({
				title: 'Here are all your Credentials',
				credentials: results,
			});
		} else {
			this.setState({ title: 'No Credentials to Display' });
		}
	}

	renderCards() {
		console.log('DisplayCredentials # renderCards');

		const { credentials } = this.state;
		return credentials.map((row) => {
			const vc = JSON.parse(row.credential);
			return (
				<Card
					date={vc.issuanceDate.split('T')[0]}
					title={vc.id}
					desc={vc.type[1]}
					key={row.id}
					id={row.id}
				/>
			);
		});
	}

	render() {
		return (
			<View style={styles.container}>
				{/* eslint-disable-next-line react/destructuring-assignment */}
				<Text style={styles.title}>{this.state.title}</Text>
				<ScrollView>

					{this.renderCards()}
				</ScrollView>
			</View>
		);
	}
}
