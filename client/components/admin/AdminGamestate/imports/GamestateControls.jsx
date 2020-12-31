import { Meteor } from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';
import { Radio, Form, Button, Header } from 'semantic-ui-react';

import GamestateComp from '../../../imports/GamestateComp';

class GamestateControlsInner extends Component {

  constructor(props) {
    super(props);
    this.state = {
      reportDLBusy: false,
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
    return (
      <Form onSubmit={ (e) => e.preventDefault() }>
        <Header as="h3" content="Emails and Reports" />
        <Form.Group>
          <Form.Button icon="mail" content="Email (all 3) Reports to Me" onClick={(e) => Meteor.call('admin.sendReport')}/>
        </Form.Group>

        <Form.Group>
          <Form.Button icon="mail" content="Email List of Users & Teams to Me" onClick={(e) => { Meteor.call('admin.sendUsersAndTeams'); alert("Emails are sending!"); }}/>
        </Form.Group>

        <Header as="h4" content="Generate and Download Reports" />
        <Form.Group>
          { this._reportDownloadButton("Users", 0) }
          { this._reportDownloadButton("Transactions", 1) }
          { this._reportDownloadButton("Gear Orders", 2) }
        </Form.Group>

        <Form.Group>
          { this._fieldButton('doSendNightlyReports', "Nightly Reports") }
        </Form.Group>

        <Header as='h3' content='Registration and Gear'/>
        <Form.Group>
          { this._fieldButton('Registration') }
          </Form.Group>
        <Form.Group>
          { this._fieldButton('buyGear', '"Buy Gear" Button (on homepage)') }
        </Form.Group>

        <Header as='h3' content='Game Day!'/>
        <Form.Group>
          { this._fieldButton('CheckIn') }
        </Form.Group>
        <Form.Group>
          { this._fieldButton('Gameplay') }
        </Form.Group>

        <Header as='h3' content='Leaderboard'/>
        <Form.Group>
          { this._fieldButton('Leaderboard') }
        </Form.Group>
      </Form>
    );
  }

  _reportDownloadButton(name, index) {
    return (
      <Form.Button icon="download"
        content={name}
        onClick={ ()=> this._getReport(index) }
        disabled={this.state.reportDLBusy} />
    );
  }

  _fieldButton(fieldName, displayName) {
    if(!displayName){
      displayName = fieldName;
      fieldName = fieldName.toLowerCase();
    }
    const fieldValue = this.props.gamestate[fieldName];
    return (
      <Radio toggle
        checked={fieldValue}
        label={displayName}
        onClick={(e) => this._toggleField(e, fieldName) }
      />
    );
  }

  _toggleField(e, fieldName) {
    e.preventDefault();
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
