import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { Radio, Container, Input, Button, Header } from 'semantic-ui-react';

import GamestateComp from '../../../imports/GamestateComp';

class GamestateControlsInner extends Component {

  constructor(props) {
    super(props);
    this.state = this._stateFromProps(props);
    this._getReport = this._getReport.bind(this);
  }

  _stateFromProps(props) {
    if (props.gamestate) {
      return({
        registration: props.gamestate.registration,
        registrationInPersonOpen: props.gamestate.registrationInPersonOpen,
        registrationVirtualOpen: props.gamestate.registrationVirtualOpen,
        gameplay: props.gamestate.gameplay,
        webinarURL: props.gamestate.webinarURL,
        webinarID: props.gamestate.webinarID,
        livestreamBackupURL: props.gamestate.livestreamBackupURL,
	message1show: props.gamestate.message1show,
	message1icon: props.gamestate.message1icon,
	message1text: props.gamestate.message1text,
	message1url: props.gamestate.message1url,
	message2show: props.gamestate.message2show,
	message2icon: props.gamestate.message2icon,
	message2text: props.gamestate.message2text,
	message2url: props.gamestate.message2url
      });
    } else {
      return({});
    }
  }

  componentWillReceiveProps(props) {
    this.setState(this._stateFromProps(props));
  }

  handleChange = (e, { name, value }) => this.setState({ [name]: value })

  render() {
    if (this.props.ready) {
      return this._renderForm();
    }
    else {
      return <Loading />;
    }
  }

  _getReport(index) {
    let self = this;
    this.setState({reportDLBusy: true});
    Meteor.call('admin.downloadReport', index, (error, result) => {
      self.setState({reportDLBusy: false});
      if(error){
        console.log(error);
        alert(`Failed to generate report. ${error.message}. See logs for details`);
      } else if(result) {
        let encodedUri = `data:text/csv;charset=${result.encoding},` +
          encodeURI(result.content);
        window.open(encodedUri);
      } else {
        alert("Something went wrong - no error but also no data.");
      }
    });
  }

  _renderForm() {
    const sendReportsTo = this.props.gamestate.sendReportsTo || [];
    let registration_status = this.state.registration === true ?
        "TRUE" : ( this.state.registration === false ? "FALSE" : "unset" );
    return (
      <Container>
        <Header as="h3" content="Emails and Reports" />

        <Header as="h4" content="Generate and Download Reports" />
        { this._reportDownloadButton("Users", 0) }
        { this._reportDownloadButton("Transactions", 1) }
        { this._reportDownloadButton("Gear Orders", 2) }
        { this._reportDownloadButton("Leaderboard", 3) }

        <Header as="h4" content="Email Reports" />
        <Button icon="mail" content="Email (all 3) Reports to Me"
          onClick={(e) => Meteor.call('admin.sendReport')} />
        <Button icon="mail" content="Email List of Users & Teams to Me"
          onClick={(e) => {
            Meteor.call('admin.sendUsersAndTeams'); alert("Emails are sending!");
          }} />
        <Button icon="mail" content="Email Leaderboard to Me"
          onClick={(e) => Meteor.call('admin.sendLeaderboard')} />

        <Header as="h4" content="Nightly Reports" />
        <div>
          {sendReportsTo.map(email => {
            return (
              <Button
                onClick={() => this.removeRecipient(email)}
                key={email}
                content={email}
                icon="x"
                color="red"
                size="tiny" />
            );
          })}
        </div>
        <div style={{marginTop: 10, marginBottom: 10}}>
          <Input
            placeholder="you@example.com"
            name="reportEmail"
            size="small"
            value={this.state.reportEmail}
            onChange={this.handleChange}
            />

          <Button
            content="Add recipient to reports list"
            onClick={() => this.addRecipient(this.state.reportEmail)} />
        </div>
        { this._fieldButton('doSendNightlyReports', "Nightly Reports") }

	<Header as='h3' content='Announcements'/>

	{ this._fieldButton('message1show', 'Show message 1') }
        <Input
          placeholder="none"
          name="message1icon"
          size="small"
          label="Icon 1"
          value={this.state.message1icon}
          onChange={ (e) => this._handleMessageChange(e) }
        />
        <Input
          placeholder="message"
          name="message1text"
          size="small"
          label="Message 1"
          value={this.state.message1text}
          onChange={ (e) => this._handleMessageChange(e) }
        />
        <Input
          placeholder="message"
          name="message1url"
          size="small"
          label="URL 1"
          value={this.state.message1url}
          onChange={ (e) => this._handleMessageChange(e) }
        />
	
	{ this._fieldButton('message2show', 'Show message 2') }
        <Input
          placeholder="none"
          name="message2icon"
          size="small"
          label="Icon 2"
          value={this.state.message2icon}
          onChange={ (e) => this._handleMessageChange(e) }
        />
        <Input
          placeholder="message"
          name="message2text"
          size="small"
          label="Message 2"
          value={this.state.message2text}
          onChange={ (e) => this._handleMessageChange(e) }
        />
        <Input
          placeholder="message"
          name="message2url"
          size="small"
          label="URL 2"
          value={this.state.message2url}
          onChange={ (e) => this._handleMessageChange(e) }
        />
        <div style={{marginTop: 10, marginBottom: 10}}>
          <Button
            content="Update Messages"
            onClick={() => this.setMessages(this.state.message1icon,
					    this.state.message1text,
					    this.state.message1url,
					    this.state.message2icon,
					    this.state.message2text,
					    this.state.message2url)} />
	</div>
	

        <Header as='h3' content='Registration and Gear'/>
        { /* TODO: remove this after 2023 Hunt */ }
        <small>Deprecated 'register' state: {`${registration_status}`}</small>
        { this._fieldButton('registrationInPersonOpen', 'In-Person Registration') }
        { this._fieldButton('registrationVirtualOpen', 'Virtual Registration') }
        { this._fieldButton('buyGear', '"Buy Gear" Button (on homepage)') }

        <Header as='h3' content='Webinar'/>
        <Input
            placeholder="https://zoom.us/"
            name="webinarURL"
            size="small"
            label="URL"
            value={this.state.webinarURL}
            onChange={this.handleChange}
            />
        <Input
            placeholder="123 456 789"
            name="webinarID"
            size="small"
            label="ID"
            value={this.state.webinarID}
            onChange={this.handleChange}
            />
          <br />
          <Input
            placeholder="https://youtube.com/?..."
            name="livestreamBackupURL"
            size="small"
            label="Backup"
            value={this.state.livestreamBackupURL}
            onChange={this.handleChange}
            />

          <Button
            content="Update Zoom Info"
            onClick={() => this.setWebinarInfo(this.state.webinarURL, this.state.webinarID,
              this.state.livestreamBackupURL)} />
        { this._fieldButton('showWebinarLink', 'Zoom Webinar link banner')}

        <Header as='h3' content='Game Day!'/>
        { this._fieldButton('CheckIn') }
        { this._fieldButton('Gameplay') }

        <Header as='h3' content='Leaderboard'/>
        { this._fieldButton('Leaderboard') }
      </Container>
    );
  }

  _reportDownloadButton(name, index) {
    return (
      <Button icon="download"
        content={name}
        onClick={ () => this._getReport(index) }
        disabled={this.state.reportDLBusy} />
    );
  }

  removeRecipient(email) {
    if(confirm(`Are you sure you want to remove ${email} from nightly reports?`)){
      Meteor.call(`admin.gamestate.reports.removeRecipient`, email, error => {
        if (error){
          console.log(error);
          alert("Failed to remove email. " + error.reason);
        }
      });
    }
  }

  addRecipient(email) {
    if(!email) return;

    Meteor.call(`admin.gamestate.reports.addRecipient`, email, error => {
      if (error){
        console.log(error);
        alert("Failed to add email. " + error.reason);
      }
    });
  };

  setWebinarInfo(url, id, backupURL){
    Meteor.call('admin.gamestate.setWebinarInfo', url, id, backupURL, error => {
      if(error){
        console.log(error);
        alert("Failed to set webinar info. " + error.reason);
      }
    });
  }

  _handleMessageChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  setMessages(m1icon, m1text, m1url, m2icon, m2text, m2url) {
    Meteor.call('admin.gamestate.setMessages', m1icon, m1text, m1url, m2icon, m2text, m2url, error => {
      if (error) {
        console.log(error);
        alert("Failed to set messages. " + error.reason);
      }
    });
  }

  _fieldButton(fieldName, displayName) {
    if(!displayName){
      displayName = fieldName;
      fieldName = fieldName.toLowerCase();
    }
    const fieldValue = this.props.gamestate[fieldName];
    return (
      <div style={{marginTop: 10, marginBottom: 10}}>
        <Radio toggle
          checked={fieldValue}
          label={displayName}
          onClick={(e) => this._toggleField(fieldName) }
        />
      </div>
    );
  }

  _toggleField(fieldName) {
    if (confirm(`Are you sure you want to toggle ${fieldName}?`)) {
      Meteor.call(`admin.gamestate.toggleField`, fieldName, (error, result) => {
        if (error) alert(error.reason);
      });
    }
  }
}

GamestateControlsInner.propTypes = {
  ready: PropTypes.bool.isRequired,
  gamestate: PropTypes.object,
};

export const GamestateControls = GamestateComp(GamestateControlsInner);
