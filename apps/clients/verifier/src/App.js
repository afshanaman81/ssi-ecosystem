import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Nav, Container, Row, Col } from 'react-bootstrap';
import { BrowserRouter as Router, Switch, Route, NavLink } from "react-router-dom";

import './App.css';

import logo from './images/logo.png'
import Verifier from './components/Verifier.js'

export default function App() {
	return (
		<Router basename={process.env.PUBLIC_URL}>
			<Container fluid="true">
				<Row className="row" noGutters>
					<Col xs={12} sm={6} md={6} xl={7} className="left-pane">
						<Nav.Item as="li">
							<Nav.Link as={NavLink} to="/" ><img src={logo} className="Affinidi-logo" alt="logo" /></Nav.Link>
						</Nav.Item>

						<Nav defaultActiveKey="/" as="ul">
							<Nav.Item as="li">
								<Nav.Link as={NavLink} to="/verifier" >Verifier</Nav.Link>
							</Nav.Item>
						</Nav>
					</Col>

					<Col className="right-pane">
						<Switch>
							<Route exact path="/"/>
							<Route path="/verifier" component={Verifier} />
						</Switch>
					</Col>

				</Row>
			</Container>
		</Router>
	);
}
