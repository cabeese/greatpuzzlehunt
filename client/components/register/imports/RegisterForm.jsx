import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { Segment,
  Header,
  Form,
  Button,
  Icon,
  List,
  Dropdown,
  Message,
  Radio,
  Popup,
} from 'semantic-ui-react';
import { pick } from 'lodash';
import { gameModeOptions, gameModeEnum, } from '../../../../lib/imports/util'

import GamestateComp from '../../imports/GamestateComp';

const { registrationCloseDate, eventYear, eventDate, eventDay } = Meteor.settings.public;

const { fromEmail } = Meteor.settings.public;

const accountTypeOptions = [
  { key: 'student', value: 'STUDENT', text: 'Student (currently enrolled in any school)' },
  { key: 'nonstudent', value: 'NONSTUDENT', text: 'Non-Student (not currently enrolled)' },
  { key: 'volunteer', value: 'VOLUNTEER', text: 'Volunteer (does not play in game)' },
];

/* States now include Canadian provinces, but we'll leave the variable name the same */
const STATES = [
  { key: 'WA', text: 'WA', value: 'WA' },
  { key: 'AL', text: 'AL', value: 'AL' },
  { key: 'AK', text: 'AK', value: 'AK' },
  { key: 'AS', text: 'AS', value: 'AS' },
  { key: 'AZ', text: 'AZ', value: 'AZ' },
  { key: 'AR', text: 'AR', value: 'AR' },
  { key: 'CA', text: 'CA', value: 'CA' },
  { key: 'CO', text: 'CO', value: 'CO' },
  { key: 'CT', text: 'CT', value: 'CT' },
  { key: 'DE', text: 'DE', value: 'DE' },
  { key: 'DC', text: 'DC', value: 'DC' },
  { key: 'FM', text: 'FM', value: 'FM' },
  { key: 'FL', text: 'FL', value: 'FL' },
  { key: 'GA', text: 'GA', value: 'GA' },
  { key: 'GU', text: 'GU', value: 'GU' },
  { key: 'HI', text: 'HI', value: 'HI' },
  { key: 'ID', text: 'ID', value: 'ID' },
  { key: 'IL', text: 'IL', value: 'IL' },
  { key: 'IN', text: 'IN', value: 'IN' },
  { key: 'IA', text: 'IA', value: 'IA' },
  { key: 'KS', text: 'KS', value: 'KS' },
  { key: 'KY', text: 'KY', value: 'KY' },
  { key: 'LA', text: 'LA', value: 'LA' },
  { key: 'ME', text: 'ME', value: 'ME' },
  { key: 'MH', text: 'MH', value: 'MH' },
  { key: 'MD', text: 'MD', value: 'MD' },
  { key: 'MA', text: 'MA', value: 'MA' },
  { key: 'MI', text: 'MI', value: 'MI' },
  { key: 'MN', text: 'MN', value: 'MN' },
  { key: 'MS', text: 'MS', value: 'MS' },
  { key: 'MO', text: 'MO', value: 'MO' },
  { key: 'MT', text: 'MT', value: 'MT' },
  { key: 'NE', text: 'NE', value: 'NE' },
  { key: 'NV', text: 'NV', value: 'NV' },
  { key: 'NH', text: 'NH', value: 'NH' },
  { key: 'NJ', text: 'NJ', value: 'NJ' },
  { key: 'NM', text: 'NM', value: 'NM' },
  { key: 'NY', text: 'NY', value: 'NY' },
  { key: 'NC', text: 'NC', value: 'NC' },
  { key: 'ND', text: 'ND', value: 'ND' },
  { key: 'MP', text: 'MP', value: 'MP' },
  { key: 'OH', text: 'OH', value: 'OH' },
  { key: 'OK', text: 'OK', value: 'OK' },
  { key: 'OR', text: 'OR', value: 'OR' },
  { key: 'PW', text: 'PW', value: 'PW' },
  { key: 'PA', text: 'PA', value: 'PA' },
  { key: 'PR', text: 'PR', value: 'PR' },
  { key: 'RI', text: 'RI', value: 'RI' },
  { key: 'SC', text: 'SC', value: 'SC' },
  { key: 'SD', text: 'SD', value: 'SD' },
  { key: 'TN', text: 'TN', value: 'TN' },
  { key: 'TX', text: 'TX', value: 'TX' },
  { key: 'UT', text: 'UT', value: 'UT' },
  { key: 'VT', text: 'VT', value: 'VT' },
  { key: 'VI', text: 'VI', value: 'VI' },
  { key: 'VA', text: 'VA', value: 'VA' },
  { key: 'WV', text: 'WV', value: 'WV' },
  { key: 'WI', text: 'WI', value: 'WI' },
  { key: 'WY', text: 'WY', value: 'WY' },

  /* Canadian Provinces */
  { key: 'NL', text: 'NL', value: 'NL' },
  { key: 'PE', text: 'PE', value: 'PE' },
  { key: 'NS', text: 'NS', value: 'NS' },
  { key: 'NB', text: 'NB', value: 'NB' },
  { key: 'QB', text: 'QB', value: 'QB' },
  { key: 'ON', text: 'ON', value: 'ON' },
  { key: 'MB', text: 'MB', value: 'MB' },
  { key: 'SK', text: 'SK', value: 'SK' },
  { key: 'AB', text: 'AB', value: 'AB' },
  { key: 'BC', text: 'BC', value: 'BC' },
  { key: 'YT', text: 'YT', value: 'YT' },
  { key: 'NT', text: 'NT', value: 'NT' },
  { key: 'NU', text: 'NU', value: 'NU' },
  { key: 'OTHER', text: 'OTHER', value: 'OTHER' }
];

class RegisterForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: 'register',
      email: '',
      firstname: '',
      lastname: '',
      accountType: '',
      password: '',
      confirmPassword: '',
      gameMode: '',
      playingPuzzleHunt: false,
      playingTreasureHunt: false,
      coords: '',
      phone: '',
      age: '',
      address: '',
      city: '',
      zip: '',
      state: '',
      country: '',
      ecName: '',
      ecRelationship: '',
      ecPhone: '',
      ecEmail: '',
      parentGuardian: '',
      photoPermission: true,
      holdHarmless: false,
      showHoldHarmless: false,
    };
  }

  render() {
    if (!this.props.ready) {
      return <Loading/>
    } else if (this.props.gamestate.registrationInPersonOpen ||
               this.props.gamestate.registrationVirtualOpen ||
               this.props.gamestate.registrationTreasureHuntOpen) {
      return this._renderMain();
    } else {
      return <Message
        info
        header='Registration is closed'
        content="Next year's Great Puzzle Hunt is in development" />;
    }
  }

  _renderMain() {
    switch (this.state.mode) {
      case 'loading':
        return <Loading />;
      case 'thankyou':
        return this._thankyou();
      default:
        return this._form();
    }
  }

  _thankyou() {
    return (
      <Segment basic>
        <Message icon>
          <Icon name='mail' color='green'/>
          <Message.Content>
            <Header as='h3'>Thank you for creating an account!<br/></Header>
            <p>We have sent a verification email to <strong>{ this.state.email }</strong>. Go check your email!</p>
              <p><strong>You must click the verification link in that email</strong> in order to complete the registration process.</p>
	      <p>If you don't get the verification email, please check your spam folder or equivalent. Be sure to add <strong>{ fromEmail }</strong> to your address book or safe sender list so all future emails get to your inbox.</p>
          </Message.Content>
        </Message>

      </Segment>
    );
  }

  _form() {
    const gameModeConflict = this.state.playingTreasureHunt && this.state.gameMode === "VIRTUAL";
    const registrationPuzzleHuntOpen = this.props.gamestate.registrationInPersonOpen ||
          this.props.gamestate.registrationVirtualOpen;
    const registrationTreasureHuntOpen = this.props.gamestate.registrationTreasureHuntOpen;
    return (
      <div>
        <Form onSubmit={ async (e) => { await this._register(e); } } style={ this._formStyle() }>
        <Header as='h1' icon={<Icon name='user' color='green'/>} content={`Create account for the ${eventYear} Great Puzzle Hunt and/or Treasure Hunt`} subheader={`${eventDate} at 9:30am Pacific Time`} />
        {/* materials banner
        <Message color='orange' size='huge'>
          <Message.Content>
            <Segment basic size='large' className='no-padding'>Game day is soon! Make sure at least one team member can obtain the <a target="_blank" href="https://gph-distributed.s3-us-west-2.amazonaws.com/GPH2021-what-you-need.pdf">necessary materials</a>.<br/>We will send an email to verify your registration. Be sure to add <strong>{ fromEmail }</strong> to your address book or safe sender list so all future emails get to your inbox. </Segment>
          </Message.Content>
        </Message>
        */}

        <p><strong>Important</strong>: Without valid name, email, or mailing address, you eliminate the chances to receive prizes. We use age to guide our puzzle development and location to make certain we geodistribute the files to proper sites that can be accessed by all participants.</p>

        {this._errorMessage()}

        <Form.Group widths='equal'>
          <Form.Input name='firstname' label='First Name' placeholder='First Name'
                      value={this.state.firstname} onChange={(e) => this._handleTextChange(e)} />
          <Form.Input name='lastname' label='Last Name' placeholder='Last Name'
                      value={this.state.lastname} onChange={(e) => this._handleTextChange(e)} />
        </Form.Group>
        
        <Form.Group widths='equal'>
          <Form.Input name='email' type='email' label='Email' placeholder='your@email.com'
                      value={ this.state.email } onChange={ (e) => this._handleTextChange(e) }/>
          <Form.Dropdown name='accountType' label='Account Type' placeholder='Account Type'
                      selection options={accountTypeOptions} value={ this.state.accountType }
                      onChange={ (e, data) => this._handleDataChange(e, data) }/>
        </Form.Group>

        <Form.Group widths='equal'>
          <Form.Input name='password' type='password' label='Password' placeholder='password'
                      value={ this.state.password } onChange={ (e) => this._handleTextChange(e) }/>
          <Form.Input name='confirmPassword' type='password' label='Confirm Password'
                      placeholder='password again' value={ this.state.confirmPassword }
                      onChange={ (e) => this._handleTextChange(e) }/>
        </Form.Group>

        { this._gameModeNote(this.props.gamestate.registrationInPersonOpen) }

        <Form.Group widths='equal' grouped>
          <Form.Dropdown name='gameMode' label='Anticipated Game Mode'
                         placeholder='Virtual vs In-Person...'
                         error={gameModeConflict}
                         selection options={gameModeOptions} value={ this.state.gameMode }
                         onChange={ (e, data) => this._handleDataChange(e, data) }/>
        </Form.Group>

        <Form.Group widths='equal' grouped>
          <p>
            <strong>Activity Selection</strong>
            &nbsp;&nbsp;
            <Popup trigger={<Icon name='help' color='red' />}
                   content='Optionally participate in a wayfinding "Treasure Hunt" after the Puzzle Hunt. You may register for either or both!'
            />
          </p>
          <Form.Checkbox
            toggle
            defaultChecked={this.state.playingPuzzleHunt}
            name='playingPuzzleHunt'
            label="Participating in the Great Puzzle Hunt"
            disabled={!registrationPuzzleHuntOpen}
            onChange={ (e,data) => this._handleDataChange(e,data) } />
          <Form.Checkbox
            toggle
            error={gameModeConflict ? {
              content: 'Treasure Hunt is only open to in-person players',
              pointing: 'left',
            } : null}
            defaultChecked={this.state.playingTreasureHunt}
            disabled={!registrationTreasureHuntOpen}
            name='playingTreasureHunt'
            label="Participating in the Treasure Hunt"
            onChange={ (e,data) => this._handleDataChange(e,data) } />
        </Form.Group>

        <Header as='h3' icon={<Icon name='home' color='blue'/>} content='Player Details'
                subheader='This information is required in the case of emergency.'/>

        <Form.Group widths='equal'>
          <Form.Input name='phone' type='tel' label='Phone (US/Canada only)' placeholder='555-555-1234'
                      value={ this.state.phone } onChange={ (e) => this._handleTextChange(e) }/>
          <Form.Input name='age' type='text' label='Age' placeholder='Number of revolutions around sun'
                      value={ this.state.age } onChange={ (e) => this._handleTextChange(e) }/>
        </Form.Group>

        <Form.Group widths='equal'>
          <Form.Input name='address' type='text' label='Mailing Address' placeholder='123 Main St'
                      value={ this.state.address } onChange={ (e) => this._handleTextChange(e) }/>
          <Form.Input name='city' type='text' label='City' placeholder='e.g. Bellingham'
                      value={ this.state.city } onChange={ (e) => this._handleTextChange(e) }/>
        </Form.Group>

        <Form.Group widths='equal'>
          <Form.Input name='zip' label='Zip/Postal Code' placeholder='e.g. 98225' value={ this.state.zip }
                      onChange={ (e) => this._handleTextChange(e) }/>
          <Form.Dropdown name='state' label='State/Province (or "other")' search selection options={ STATES }
                      value={ this.state.state } onChange={ (e,data) => this._handleDataChange(e,data) }/>
          <Form.Input name='country' label='Country' placeholder='e.g. U.S.A.' value={ this.state.country }
                      onChange={ (e) => this._handleTextChange(e) }/>
        </Form.Group>

        <Header as='h3' icon={<Icon name='ambulance' color='red'/>}
                content='Emergency Contact'
                subheader='This information is required in the case of emergency.'/>

        <Form.Group widths='equal'>
          <Form.Input name='ecName' label='Full Name' placeholder='Emergency Contact'
                      value={ this.state.ecName } onChange={ (e) => this._handleTextChange(e) }/>
          <Form.Input name='ecRelationship' label='Relationship'
                      placeholder='How you know this person' value={ this.state.ecRelationship }
                      onChange={ (e) => this._handleTextChange(e) }/>
        </Form.Group>

        <Form.Group widths='equal'>
          <Form.Input name='ecPhone' label='Phone (US/Canada Only)' placeholder='A phone they will answer'
                      value={ this.state.ecPhone } onChange={ (e) => this._handleTextChange(e) }/>
          <Form.Input name='ecEmail' label='Email' placeholder='A reliable email'
                      value={ this.state.ecEmail } onChange={ (e) => this._handleTextChange(e) }/>
        </Form.Group>

        { this._parentGuardian()}

        <List>
          <List.Item><strong>Participants under age 18 who are not enrolled WWU students</strong>: A parent/legal guardian must complete this registration form on behalf of their minor. </List.Item>
          <List.Item><strong>Participants under age 14</strong>: A parent/legal guardian must complete this registration form on behalf of their minor. In addition, at least one adult must register as a team member on a team with any participants under age 14 and accompany them at all times during the Puzzle Hunt and/or Treasure Hunt.</List.Item>
        </List>

        <Header as='h3' icon={<Icon name='camera' color='violet'/>} content='Photo Permission'/>

        <Form.Checkbox
          toggle
          defaultChecked={this.state.photoPermission}
          name='photoPermission'
          label="I hereby give my permission to Western and the Great Puzzle Hunt to use my (or my minor child's) image, in photo or video, in whole or in part, for public information and marketing of the WWU Great Puzzle Hunt and/or Treasure Hunt at its discretion."
          onChange={ (e,data) => this._handleDataChange(e,data) } />

        <Header as='h3' icon={<Icon name='pencil' color='orange'/>}
                content='Acknowledgment of Risk & Hold Harmless Agreement' />

        { this._holdHarmlessButton() }

        { this._holdHarmless() }

        <Form.Checkbox
          toggle
          defaultChecked={this.state.holdHarmless}
          name='holdHarmless'
          label='By checking this box, I acknowledge that I have read and understand the Risk & Hold Harmless Agreement and that I am either 18+ years old or an enrolled WWU student or the parent/guardian of a minor participant.'
          onChange={ (e,data) => this._handleDataChange(e,data) }/>

        <Form.Button fluid type='submit' content='Submit' color='green'/>

        { this._errorMessage() }
      </Form>
      </div>
    );
  }

  _formStyle() {
    return {
      maxWidth: '640px',
      marginRight: 'auto',
      marginLeft: 'auto',
    };
  }

  _getNextValidationError() {
    if (this.state.playingTreasureHunt && this.state.gameMode === "VIRTUAL") {
      return "The Treasure Hunt is only open to in-person players";
    }

    return null;
  }

  async _register(e) {
    e.preventDefault();

    const validationError = this._getNextValidationError();
    if (validationError) {
      this.setState({ error: {
        reason: validationError,
      }});
      return;
    }

    this.setState({ mode: 'loading' });

    const data = this._registrationData();

    try {
      await Meteor.callAsync('user.register', data);
      this.setState({ error: null, mode: 'thankyou' });
    } catch(error) {
      this.setState({ error, mode: 'register' });
      return;
    }
  }

  _gameModeNote(inPersonOpen) {
    if (inPersonOpen) {
      return (
        <p><strong>Note:</strong> game mode can be changed
          until {registrationCloseDate}.
        </p>
      );
    } else {
      return (
        <Message
          color='yellow'
          header='Puzzle Hunt in-person registration is now closed'
          content="We are no longer accepting additional in-person Puzzle Hunt players for this year"
        />
      );
    }
  }

  _registrationData() {
    const fields = [
        'firstname', 'lastname', 'email', 'accountType', 'password', 'confirmPassword', 'gameMode',
        'playingTreasureHunt', 'playingPuzzleHunt',
        'coords', 'phone', 'age', 'address', 'city', 'zip', 'state', 'country',
        'ecName', 'ecRelationship', 'ecPhone', 'ecEmail', 'parentGuardian',
        'photoPermission', 'holdHarmless'
    ];

    return pick(this.state, fields);
  }

  _handleTextChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  _handleDataChange(e, data) {
    const { name, value, checked } = data;
    this.setState({ [name]: (value || checked) });
  }

  _handleCheckBoxChange(e) {
    const { name, value } = e.target;
  }

  _holdHarmlessButton() {
    if (this.state.showHoldHarmless) {
      return <Button as='a' basic content='Hide Agreement' onClick={ (e) => this.setState({ showHoldHarmless: false }) }/>
    }
    else {
      return <Button as='a' basic content='Show Agreement' onClick={ (e) => this.setState({ showHoldHarmless: true }) }/>
    }
  }

  _holdHarmless() {
    if (!this.state.showHoldHarmless) return <p></p>;
    return (
      <Segment basic>
        <p>I hereby acknowledge that I have voluntarily chosen (or voluntarily chosen to allow my minor
child) to participate either in-person or virtually in the {eventYear} WWU Great Puzzle Hunt and/or WWU Treasure Hunt sponsored by the WWU Mathematics Department, held on {eventDay}, {eventDate} (hereinafter referred to as “Puzzle Hunt” and/or “Treasure Hunt”). I understand the risks involved in the Puzzle Hunt and/or Treasure Hunt, including the unlikely but potential risk of
injury to me (or my minor child), and I agree to accept any and all risks associated with my participation.</p>
        <p>In consideration of my (or my minor child’s) voluntary participation in the Puzzle Hunt and/or Treasure Hunt, I agree to hold harmless Western Washington University, its officers, agents, volunteers, or employees from and against all financial loss, claim, suit, action, damage, or expense, arising out of my (or my minor child’s) participation, unless caused by the negligence or willful misconduct of the University, its officers, agents, volunteers, or employees.</p>
        <p><strong>In-Person Participation</strong>: I understand that Western Washington University strongly recommends that participants have comprehensive health insurance coverage.</p>
        <p>If you are feeling ill, please stay home. Masks are no longer required on Western's campus, but please be understanding, respectful, and considerate of individual choices to mask or not to mask.</p>
        <p>I understand and acknowledge that a medical emergency may develop which necessitates the need for immediate medical treatment for a participant. I hereby authorize Western and its officers, agents, volunteers, or employees to arrange or provide any necessary emergency medical treatment on my (or my minor child’s) behalf.</p>
        <p><strong>Virtual Participation</strong>: For the virtual event, all participation is done online and communications involving issues such as registration questions, troubleshooting, event updates, or awards will be done via text, email, phone, social media, and the website <a href="https://greatpuzzlehunt.com">https://greatpuzzlehunt.com</a>. Participants will be asked to use a smartphone or computer, and such items as scissors, writing utensils (colored pencils, pen, pencil, highlighters, felt tips), tape, eraser, paper, straightedge, hole punch, and a printer to print out puzzles. I agree (or give permission for my minor child) to receive direct communication from Western’s {eventYear} Great Puzzle Hunt staff.</p>
      </Segment>
    );
  }

  _parentGuardian() {
    const age = parseInt(this.state.age);
    if ((age < 14) || (age === NaN)) {
      return (
        <Form.Input
          name='parentGuardian'
          type='text'
          label="Parent/Guardian accompanying player if under the age of 14"
          placeholder='Full name of legal parent/guardian'
          value={ this.state.parentGuardian }
          onChange={ (e) => this._handleTextChange(e) }/>
      );
    } else {
      return null;
    }
  }

  _errorMessage() {
    if (!this.state.error) return null;
    return <Message negative
      icon='warning'
      title='There were issues registering!'
      content={ this.state.error.reason }
      onDismiss={ (e) => this.setState({ error: null }) } />
  }
}

export default GamestateComp(RegisterForm);
