import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { Radio, Container, Input, Button, Header, Form, } from 'semantic-ui-react';

import GamestateComp from '../../../imports/GamestateComp';

async function callMeteorMethod(methodName, ...args) {
  try {
    await Meteor.callAsync(methodName, ...args);
    return true;
  } catch(error) {
    console.error(`Failed to call meteor method "${methodName}" with args`,
                  ...args);
    console.log(error);
    alert(`${methodName} failed: ${error.message}`);
    return false;
  }
}


class GamestateControlsInner extends Component {

  constructor(props) {
    super(props);
    this.state = {
      reportDLBusy: false,
      reportEmail: "",
      webinarURL: "",
      webinarID: "",
      livestreamBackupURL: "",
      bannerMarkdown: "",
      displayBanner: false,
      givingURL: "",
    };
    this._getReport = this._getReport.bind(this);
  }

  componentWillReceiveProps(props) {
    if (props.gamestate) {
      this.setState({
        registration: props.gamestate.registration,
        registrationInPersonOpen: props.gamestate.registrationInPersonOpen,
        registrationVirtualOpen: props.gamestate.registrationVirtualOpen,
        gameplay: props.gamestate.gameplay,
        webinarURL: props.gamestate.webinarURL || "",
        webinarID: props.gamestate.webinarID || "",
        bannerMarkdown: props.gamestate.bannerMarkdown || "",
        displayBanner: props.gamestate.displayBanner,
        givingURL: props.gamestate.givingURL || "",
        livestreamBackupURL: props.gamestate.livestreamBackupURL || "",
      });
    }
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

  async _getReport(index) {
    let self = this;
    this.setState({reportDLBusy: true});
    await Meteor.callAsync('admin.downloadReport', index, (error, result) => {
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
                onClick={async (e) => {
                  await callMeteorMethod('admin.sendReport');
                }} />
        <Button icon="mail" content="Email List of Users & Teams to Me"
          onClick={async (e) => {
            await callMeteorMethod('admin.sendUsersAndTeams');
          }} />
        <Button icon="mail" content="Email Leaderboard to Me"
          onClick={async (e) => await callMeteorMethod('admin.sendLeaderboard')} />

        <Header as="h4" content="Nightly Reports" />
        <div>
          {sendReportsTo.map(email => {
            return (
              <Button
                onClick={async () => await this.removeRecipient(email)}
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
            onClick={async () => await this.addRecipient(this.state.reportEmail)} />
        </div>
        { this._fieldButton('doSendNightlyReports', "Nightly Reports") }

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

        <Header as='h3' content='Banner' />
        { this._fieldButton("displayBanner", "Display Banner on Home Page") }
	<Form onSubmit={async (e) => await this.setBanner(e)}>
	  <Form.TextArea label='Banner (Markdown Supported)'
                         style={{ fontFamily: "courier" }}
                         placeholder="# Markdown-supported announcement"
                         name='bannerMarkdown' value={this.state.bannerMarkdown}
                         onChange={this.handleChange}
          />
          <p>Try the <a href="https://marked.js.org/demo/">marked demo</a> to
            get a markdown preview.</p>
          <Button type="submit">Save Banner</Button>
        </Form>

	<Header as='h3' content='Donation'/>
        <Input
          placeholder="https://foundation.wwu.edu/greatpuzzlehunt"
            name="givingURL"
            size="small"
            label="URL"
            value={this.state.givingURL}
            onChange={this.handleChange}
        />
	<br />
        <Button
          content="Update donation info"
          onClick={() => this.setGivingURL(this.state.givingURL)} />
	
      </Container>
    );
  }

  _reportDownloadButton(name, index) {
    return (
      <Button icon="download"
        content={name}
        onClick={ async () => await this._getReport(index) }
        disabled={this.state.reportDLBusy} />
    );
  }

  async removeRecipient(email) {
    if(confirm(`Are you sure you want to remove ${email} from nightly reports?`)){
      await callMeteorMethod(`admin.gamestate.reports.removeRecipient`, email);
    }
  }

  async addRecipient(email) {
    if(!email) return;

    await callMeteorMethod(`admin.gamestate.reports.addRecipient`, email);
  };

  async setWebinarInfo(url, id, backupURL){
    await callMeteorMethod('admin.gamestate.setWebinarInfo', url, id, backupURL);
  }

  async setBanner(e){
    e.preventDefault();
    const { bannerMarkdown } = this.state;
    await callMeteorMethod('admin.gamestate.setBannerMarkdown', bannerMarkdown);
  }

  _fieldButton(fieldName, displayName) {
    if(!displayName){
      displayName = fieldName;
      fieldName = fieldName.toLowerCase();
    }
    const fieldValue = this.props.gamestate[fieldName];
    return (
      <div style={{marginTop: 10}}>
        <Radio toggle
          checked={fieldValue}
          label={displayName}
          onClick={async (e) => await this._toggleField(fieldName) }
        />
      </div>
    );
  }

  async _toggleField(fieldName) {
    if (confirm(`Are you sure you want to toggle ${fieldName}?`)) {
      await callMeteorMethod(`admin.gamestate.toggleField`, fieldName);
    }
  }
}

GamestateControlsInner.propTypes = {
  ready: PropTypes.bool.isRequired,
  gamestate: PropTypes.object,
};

export const GamestateControls = GamestateComp(GamestateControlsInner);
