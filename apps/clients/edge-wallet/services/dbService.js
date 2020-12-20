import { openDatabase } from 'expo-sqlite';

const dbName = 'credentials.db';
const db = openDatabase(dbName);
db.exec(
	[{ sql: 'PRAGMA foreign_keys = ON;', args: [] }],
	false,
	() => console.log('dbService # Foreign keys turned on'),
);

export default class DBService {
	static createTables = () => {
		console.log('dbService # createTables');

		db.transaction((tx) => {
			tx.executeSql(
				`CREATE TABLE IF NOT EXISTS credentials (
					id INTEGER PRIMARY KEY AUTOINCREMENT, 
					credential TEXT, 
					createdAt INTEGER)`, null,
				() => console.log('dbService # Created Table credentials'),
				(txObj, error) => console.log('dbService # Error ', error),
			);

			tx.executeSql(
				`CREATE TABLE IF NOT EXISTS credentialTypes (
					id INTEGER PRIMARY KEY AUTOINCREMENT, 
					credential_id INTEGER, 
					type TEXT)			
					`, null,
				() => console.log('dbService # Created Table credentialTypes'),
				(txObj, error) => console.log('dbService # Error ', error),
			);

			tx.executeSql(
				`CREATE TABLE IF NOT EXISTS services (
					id INTEGER PRIMARY KEY AUTOINCREMENT, 
					provider TEXT,
					description TEXT, 
					type TEXT,
					approved_status INTEGER,
					startedAt INTEGER)			
					`, null,
				() => console.log('dbService # Created Table credentialTypes'),
				(txObj, error) => console.log('dbService # Error ', error),
			);
		});
	}

	static dropTables = () => {
		console.log('dbService # dropTables');

		db.transaction((tx) => {
			tx.executeSql('DROP TABLE IF EXISTS credentials');
			tx.executeSql('DROP TABLE IF EXISTS credentialTypes');
			tx.executeSql('DROP TABLE IF EXISTS services');
		});
	}

	static dropTable = (tableName) => {
		console.log('dbService # dropTable');

		db.transaction((tx) => {
			tx.executeSql(`DROP TABLE IF EXISTS ${tableName}`, null,
				() => console.log(`dbService # Dropped Table ${tableName}`),
				(txObj, error) => console.log('dbService # Error ', error));
		});
	}

	static truncateTable = (tableName) => {
		console.log('dbService # truncateTable');

		db.transaction((tx) => {
			tx.executeSql(`DELETE FROM ${tableName}`, null,
				() => console.log(`dbService # Truncated Table ${tableName}`),
				(txObj, error) => console.log('dbService # Error ', error));
		});
	}

	static getAllCredentials = async () => new Promise((resolve, reject) => {
		console.log('dbService # getAllCredentials');

		db.transaction((tx) => {
			tx.executeSql('SELECT * FROM credentials', null,
				(txObj, { rows: { _array } }) => resolve(_array),
				(txObj, error) => reject(error));
		});
	})

	static getCredentialsById = async (id) => new Promise((resolve, reject) => {
		console.log('dbService # getCredentialsById');

		db.transaction((tx) => {
			tx.executeSql('SELECT credential FROM credentials WHERE id = ?', [id],
				(txObj, { rows: { _array } }) => {
					resolve(_array);
				},
				(txObj, error) => reject(error));
		});
	})

	static getCredentialsByType = async (type) => new Promise((resolve, reject) => {
		console.log('dbService # getCredentialsByType');

		db.transaction((tx) => {
			tx.executeSql(`SELECT credential FROM credentials c
			JOIN credentialTypes ct on (c.id = ct.credential_id) 
			WHERE ct.type = ?`, [type],
			(txObj, { rows: { _array } }) => {
				resolve(_array);
			},
			(txObj, error) => reject(error));
		});
	})

	static storeCredential = async (vc) => new Promise((resolve, reject) => {
		console.log('dbService # storeCredential');

		db.transaction((tx) => {
			const createdAt = new Date().toDateString();
			tx.executeSql('INSERT INTO credentials (credential, createdAt) values (?, ?)', [JSON.stringify(vc), createdAt],
				(txObj, resultSet) => resolve(resultSet.insertId),
				(txObj, error) => reject(error));
		});
	})

	static storeCredentialTypes = async (id, vcTypes) => {
		console.log('dbService # storeCredentialTypes');

		db.transaction((tx) => {
			vcTypes.forEach((type) => {
				tx.executeSql('INSERT INTO credentialTypes (credential_id, type) values (?, ?)',
					[id, type],
					() => true,
					(txObj, error) => console.log(error));
			});
		});
	}

	static storeServiceSubscription = async () => new Promise((resolve, reject) => {
		console.log('dbService # storeServiceSubscription');

		db.transaction((tx) => {
			const startedAt = new Date().toDateString();
			// NOTE: (TODO:)
			// This is a hard-coded example to help generate the Services card
			// This should be updated to store actual values from the VP,
			// according to the application needs
			tx.executeSql(`
			INSERT INTO services (
				provider, 
				description, 
				type, 
				approved_status, 
				startedAt
			) values (?, ?, ?, ?, ?)`, [
				'xFinity Rent-a-car',
				'Business Rentals',
				'Domestic',
				1,
				startedAt,
			],
			(txObj, resultSet) => resolve(resultSet.insertId),
			(txObj, error) => reject(error));
		});
	})

	static getAllServicess = async () => new Promise((resolve, reject) => {
		console.log('dbService # getAllServicess');

		db.transaction((tx) => {
			tx.executeSql('SELECT * FROM services', null,
				(txObj, { rows: { _array } }) => resolve(_array),
				(txObj, error) => reject(error));
		});
	})
}
