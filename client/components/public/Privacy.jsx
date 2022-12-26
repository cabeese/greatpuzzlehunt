import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';


import { Container, Segment, Header, Icon, Modal, Grid, List, Card, Image } from 'semantic-ui-react';
import LinkButton from '../imports/LinkButton';

Privacy = class Privacy extends Component {
    
    constructor(props) {
	super(props);
	
	this.state = {
	    open: false
	};
    }
    
    onClose = () => this.setState({open: false});
    
    render() {
	return (
	    <Container className="section">
	      <Segment basic>
		<PuzzlePageTitle title="Privacy" />
		<Grid padded centered textAlign="left" stackable>
		  <Grid.row>
		    <Grid.Column width={16}>
		      <Header as="h1"> Great Puzzle Hunt Privacy Statement </Header>
		      <p><em>Last updated: 23 December 2022</em></p>
		      <p> This Privacy Statement discloses the privacy practices for the
			Great Puzzle Hunt systems. We refer to the web site as “Site”. </p>
		      <p> By using this Site you consent to the collection and use of your
			information as described below. This Privacy Statement governs only
			the use and disclosure of information collected through this
			Site. </p>
		      <Header as="h2">DATA COLLECTED VIA TECHNOLOGY</Header>
		      <Header as="h3">What We Collect When You Visit www.greatpuzzlehunt.com</Header>
		      <p>We, and our third-party vendors, collect certain information
			regarding your use of the Site, including but not limited to:
			<ul>
			  <li> The Internet Protocol (IP) address </li>
			  <li> Name of the Internet domain you used to access the Internet </li>
			  <li> The IP address of the website from which you linked to the Site </li>
			  <li> The date and time you accessed the Site </li>
			  <li> The pages you visited </li>
			  <li> The web browser, operating system and any device you used to access the Site </li>
			</ul>
		      </p>
		      <Header as="h3"> What We Use It For </Header>
		      <p> We use the geographic and networking information to ensure the correct
			and secure operation of the Site. </p>
		      <Header as="h2"> DATA YOU PROVIDE TO US </Header>
		      <p> The Puzzle Hunt may request that you provide certain Personally
			Identifiable Information (“PII”) to use our site. Instances where you
			use PII may include the following:
			<ul>
			  <li> To use password-protected areas </li>
			  <li> To download information </li>
			  <li> Other purposes </li>
			</ul>
		      </p>
                      <p> The Site only uses your PII when you give us that information.
			You may choose not to provide the Site with PII. </p>
		      <Header as="h2"> WHAT DO WE USE YOUR INFORMATION FOR? </Header>
		      <p> We use the information we gather from you for the following:
			<ul>
			  <li> For Puzzle Hunt business </li>
			  <li>To track user trends,
			    and prevent unauthorized
			    abuse </li>
			  <li> For the other purposes
			    described in this statement </li>
			</ul>
		      </p>
                      <p> If you send us an email, the email address you provide may be used to:
			<ul>
			  <li> Respond to inquiries, and/or your
						    requests or questions </li>
			  <li> Send you information </li>
			</ul>
		      </p>
                      <p> We will not share, rent, sell, or authorize
			any third party to use your email address, for
			commercial purposes, without your
			permission. </p>
                      <p> User information we collect may be shared
			with third-party vendors. </p>
                      <p> We prohibit third parties who receive user
			information from using or sharing that
			information, except to provide better services
			to you. </p> 
                      <p> We may provide your information to third parties for situations where we believe that doing so is necessary. Examples may include to:
			<ul>
			  <li> Satisfy laws, regulations, legal
			    processes or government requests </li>
			  <li>Detect or prevent fraud, or maintain
		              security </li>
			  <li> Protect our rights and safety, and the
			    rights and safety of our website users or
			    others </li>
			</ul>
		      </p>
                      <p> Overall, the PII you submit to us is used to
			respond to requests that you make. 
			Unless there are restrictions on use of your PII, or unless we tell you otherwise, we (or third parties engaged by us) may use your personal information to:
			<ul>
			  <li> Create and maintain your account </li>
			  <li> Communicate information like
			    newsletters, alerts, or invitations </li>
			  <li> Process and fulfill transactions for
			    services or materials </li>
			  <li> Contact you to respond to your requests
			    or inquiries  </li>
			  <li> Conduct research or surveys </li>
			  <li> Alerting you to safety alerts </li>
			  <li> Requesting donations </li>
			  <li> Responding to subpoenas, court orders
			    or legal process </li>
			  <li> Enforce our agreements </li>
			  <li> Protect the health, safety, rights or
			    property of you, us, or others </li>
			  <li> Meet legal obligations </li>
			  <li> Establish or exercise our legal rights
			    or defend against legal claims </li>
			  <li> Take action regarding fraud, unlawful
			    or criminal activity </li>n
			  <li> Take action regarding misconduct,
			    security or technical issues </li> 
			  <li> Take action regarding unauthorized
			  access to or use of Personal Data, our
			  website or data systems </li>
			</ul>
		      </p>
		      <Header as="h2"> USE OF COOKIES </Header>
		      <p> The Site transfers “cookies” to your
			computer’s hard drive through your web browser
			to collect non-personal information about your
			visit to this website.  </p>
		      <p> Cookies are small files stored on your
			computer (unless you block them). We use
			cookies to understand and save your
			preferences for future visits. Cookies help us
			compile data about website traffic. We do this
			to offer a better website experience in the
			future. </p>
		      <p> Most web browsers are set to accept cookies
			by default. You can remove and reject cookies
			from our Site with your browser settings. If
			you remove or reject our cookies, it may
			affect how our Site works for you. </p>
		      <Header as="h2">HOW LONG DO WE KEEP YOUR INFORMATION </Header>
		      <p> We only keep your personal information for
			as long as it is necessary, except when a longer
			retention period is mandatory by law.  An
			example includes for tax, accounting or other
			legal requirements.  We will not keep your PII
			longer than the time you have an account with
			us.</p>
		      <p> When we no longer need to process your PII,
			we will either delete or anonymize it. We only
			keep your personal information as long as you
			have an account with us or as long as is
			required by law. </p>
		      <p> If this is not possible, then we will store
			your PII securely until deletion is possible. </p>
		      <Header as="h2"> YOUR PRIVACY RIGHTS </Header>
		      <p> In some regions within the European Economic
			Area (EEA) you have certain rights to your
			data.</p> 
		      <p> Under applicable data protection laws, your
			rights may include:
			<ul>
			  <li> To request access and obtain a copy of
			    your personal information </li>
			  <li> To request correction or erasure of
			    date </li>
			  <li> To restrict the processing of your
			    personal information and </li>
			  <li> (If applicable) To the right to
			    transfer your data (Data
			    Portability) </li>
			</ul>
		      </p>
		      <p> If we rely on your consent to process your
			personal information, you may withdraw consent
			at any time.</p> 
		      <p> If you withdraw your consent, this will not affect the lawfulness
			of our collecting, using and sharing of your Personal Information up
			to the point in time that you withdraw your consent. If you withdraw
			your consent, we may use your information that has been anonymized
			and does not personally identify you. </p>
		      <p> If you are a resident in the EEA and you
			believe we are unlawfully processing your
			personal information, you have the right to
			complain to your local data protection
			authority. If you wish to contact us in
			connection with the exercise of your rights
			listed above, please email us at
			compliance@greatpuzzlehunt.com. We will
			respond to your written request in a
			reasonable amount of time. </p>
		      <p> If you wish to contact us in connection with
			the exercise of your rights listed above,
			please email us at
			<a href="mailto:compliance@greatpuzzlehunt.com">compliance@greatpuzzlehunt.com</a>. We will
			respond to your written request in a
			reasonable amount of time. </p> 
		      <p> Unless we inform you at the time of your
			request, we will not charge you a fee to
			exercise the rights listed above.</p> 
		      <Header as="h2">LINKED SITES </Header>
		      <p> The Great Puzzle Hunt web site may provide
			links on this Website to other sites of
			interest.  Use of such linked websites is
			subject to the privacy policies of those
			providers of those websites. We encourage you
			to read the privacy policies of each website
			you visit.</p>
		      <Header as="h2">SECURITY MEASURES </Header>
		      <p> The Great Puzzle Hunt works hard to protect the security of the information that you provide to the Site.  This site has reasonable security measures in place to help protect against the loss, misuse, and alteration of the information under our control. However, no method of transmission over the Internet or method of electronic storage is 100% secure.</p>
		      <Header as="h2">CHANGES</Header>
		      <p> The Great Puzzle Hunt may change this
			Privacy Statement from time to time.  If we do
			make a change, we will post the revised
			Privacy Statement on this Website and update
			the “Last Updated” date.</p> 
		      <Header as="h2">CONTACT INFORMATION </Header>
		      <p> The Great Puzzle Hunt welcomes your comments
		      or questions regarding this Privacy
		      Statement. Please e-mail us at
		      <a href="mailto:compliance@greatpuzzlehunt.com>
		      compliance@greatpuzzlehunt.com</a>. </p>
		      
		      
		      </Grid.Column>
</Grid.Row>
</Grid>
</Segment>
</Container>
)
    }

}
