/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-one-expression-per-line */
import React, { Component } from 'react';
import {
	StyleSheet, Text, View, ScrollView, Image, ToastAndroid, Alert, Platform,
} from 'react-native';
import Constants from 'expo-constants';
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
		textAlign: 'center',
	},
	cardContainer: {
		paddingTop: 15,
		paddingBottom: 15,
		marginTop: 20,
		width: 330,
		height: 180,
		shadowOpacity: 1,
		borderLeftColor: 'rgb(176, 132, 196)',
		borderLeftWidth: 10,
		borderRadius: 5,
		alignSelf: 'stretch',
		backgroundColor: 'rgb(86, 184, 190)',
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
		marginLeft: 10,
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
		borderLeftColor: 'rgb(176, 132, 196)',
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
	date, type, desc, provider, status,
}) => (
	<View style={styles.cardContainer}>

		<View style={styles.cardHeader}>
			<Image style={styles.logo} source={logo} />
			<Text style={styles.smallFont}>
				Start Date: {date}
			</Text>
		</View>

		<View style={styles.cardContent}>
			<View style={{ flexDirection: 'column' }}>
				<Text style={styles.contentFont}>Description: {desc}</Text>
				<Text style={styles.contentFont}>Type: {type}</Text>

				<Text style={styles.contentFont}>Service Provided by: {provider}</Text>
			</View>

		</View>

		<View style={styles.cardFooter}>
			<Text style={styles.smallFont}>Status:
				{status === 0 ? (
					<Text style={{ color: 'red' }}> Pending</Text>)
					:	(<Text style={{ color: 'green', fontSize: 13 }}> Approved</Text>)}

			</Text>
		</View>
	</View>
);

export default class DisplayServices extends Component {
	constructor(props) {
		super(props);

		this.state = {
			services: [],
			title: 'Loading Services ...',
		};

		this.renderCards = this.renderCards.bind(this);
	}

	async componentDidMount() {
		console.log('DisplayServices # componentDidMount');
		await this.getResultsFromDB();

		const msg = 'All your Services will be displayed here';
		if (Platform.OS === 'android') {
			ToastAndroid.showWithGravity(msg, ToastAndroid.LONG, ToastAndroid.CENTER);
		} else {
			Alert.alert(msg);
		}
	}

	async getResultsFromDB() {
		console.log('DisplayServices # getResultsFromDB');
		const results = await DBService.getAllServicess();

		if (results.length > 0) {
			this.setState({
				title: 'You have request the following Services',
				services: results,
			});
		} else {
			this.setState({ title: 'No Services to Display' });
		}
	}

	renderCards() {
		console.log('DisplayServices # renderCards');

		const { services } = this.state;
		return services.map((service) => (
			<Card
				date={service.startedAt.split('T')[0]}
				type={service.type}
				desc={service.description}
				provider={service.provider}
				status={service.approved_status}
				key={service.id}
			/>
		));
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
