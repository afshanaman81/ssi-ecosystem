import React, { Component } from 'react'
import { Container, Row, Col } from 'react-bootstrap';

import issuer from '../images/issuer.png'
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

		this.getOfferRequestToken = this.getOfferRequestToken.bind(this);
	}

	getOfferRequestToken(){
		const input = {
			offeredCredentials: [
				{ type: 'PhoneCredentialPersonV1' }
			]
		}

		const endpoint = 'offer-request-token'
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
						<h1>Issuer</h1>
						<img src={issuer} className="image" alt="logo" />
						<p><i>(e.g a Driving Licensing Department)</i></p>
						<hr className="horizontalRule"/>
					</Col>
				</Row>

				<Row className="row" noGutters>
					<Col>	
						<h3>Demo VC Claim Flow</h3>
						<br />
					</Col>
				</Row>

				<Row className="row" noGutters>
					<Col>	
						<div>	
							<button className="btn btn-info btn-block btn-width" onClick={this.getOfferRequestToken}>Get Driving Credentials</button>
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
