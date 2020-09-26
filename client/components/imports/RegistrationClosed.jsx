import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { Message } from 'semantic-ui-react';

const { eventYear, registrationOpenDate } = Meteor.settings.public;

export default class RegistrationClosed extends Component {
  render() {
    return (
      <div>
        <Message info size='large' header='Registration is Closed' content={`Registration for the ${eventYear} Great Puzzle Hunt will open ${registrationOpenDate}.`}/>
      </div>
    );
  }
}
