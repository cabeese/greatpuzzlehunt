import { Meteor } from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';
import { Radio, Container, Input, Button, Header } from 'semantic-ui-react';

import GamestateComp from '../../../imports/GamestateComp';

class GamestateControlsInner extends Component {

  constructor(props) {
    super(props);
    this.state = {
      reportDLBusy: false,
      reportEmail: "",
    };
    this._getReport = this._getReport.bind(this);
  }

  componentWillReceiveProps(props) {
    if (props.gamestate) {
      this.setState({
        registration: props.gamestate.registration,
        gameplay: props.gamestate.gameplay,
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
    return (
      <Container>
        <Header as="h3" content="Emails and Reports" />

        <Header as="h4" content="Generate and Download Reports" />
        { this._reportDownloadButton("Users", 0) }
        { this._reportDownloadButton("Transactions", 1) }
        { this._reportDownloadButton("Gear Orders", 2) }

        <Header as="h4" content="Email Reports" />
        <Button icon="mail" content="Email (all 3) Reports to Me"
          onClick={(e) => Meteor.call('admin.sendReport')} />
        <Button icon="mail" content="Email List of Users & Teams to Me"
          onClick={(e) => {
            Meteor.call('admin.sendUsersAndTeams'); alert("Emails are sending!");
          }} />

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

        <Header as='h3' content='Registration and Gear'/>
        { this._fieldButton('Registration') }
        { this._fieldButton('buyGear', '"Buy Gear" Button (on homepage)') }

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
