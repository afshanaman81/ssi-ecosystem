import React, { Component } from 'react'
import { Container, Row, Col } from 'react-bootstrap';

import verifier from '../images/verifier.png'
import QRCode from "qrcode.react"
import interopApi from '../interopApi'

export default class Issuer extends Component {
	constructor(props){
		super(props)

		this.state = {	
			QRCValue: {
				tokenUrl: ''
			},
			error: ''
		}

		this.getPresentationToken = this.getPresentationToken.bind(this);
	}

	getPresentationToken(){
		const input = {
			credentialRequirements: [
				{ type: ['VerifiableCredential', 'PhoneCredentialPersonV1'] }
			]
		}

		const endpoint = 'presentation-challenge'
		interopApi.post(endpoint, input)
			.then((res) => {
				this.setState({					
					QRCValue: {
						tokenUrl: res.data.tokenUrl		
					}					
				})
	
			}).catch((error)=> {
				this.setState({error: error.response.data.error.message})
			})
	}

	render() {
		return (
			<Container fluid="true">
				<Row className="row" noGutters>
					<Col>	
						<h1>Verifier</h1>
						<img src={verifier} className="image-large" alt="logo" />
						<p><i>(e.g a Rent-a-Car Business)</i></p>
						<hr className="horizontalRule"/>
					</Col>
				</Row>

				<Row className="row" noGutters>
					<Col>	
						<h3>Demo VP Request Flow</h3>
						<br />
					</Col>
				</Row>

				<Row className="row" noGutters>
					<Col>	
						<div>	
							<button className="btn btn-info btn-block btn-width" onClick={this.getPresentationToken}>Rent a Car</button>
							<br />
							{(this.state.QRCValue.tokenUrl) ? 
								<div>
									<br />
									<h5>Please Scan this QR code with your Wallet App</h5>
									<br />
									<QRCode
										id="123456"
										value={JSON.stringify(this.state.QRCValue, null, 2)}
										size={290}
										level={"H"}
										includeMargin={true}
									/>
								</div>
								: ''}

							{this.state.error ? (
								<div className="form-group">							
									<span><b>Error</b></span>
									<p>{this.state.error}</p>
								</div>
							): (<span></span>)}

						</div>  
					</Col>
				</Row>

			</Container>			
		)
	}
}
