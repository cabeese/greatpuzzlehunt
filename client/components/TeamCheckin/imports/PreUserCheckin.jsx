import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Segment, Icon, Button
} from 'semantic-ui-react';

class PreUserCheckin extends Component {
  render() {
    return (
      <Button fluid color="green" size="large" icon="rocket" content="Start Check-In"
              onClick={async (e) => await this._startCheckIn(e)}/>
    );
  }

  async _startCheckIn(e) {
    e.preventDefault();
    try {
      await Meteor.callAsync('team.checkin.start');
    } catch (error) {
      alert(`Oops! ${error.reason}`);
    }
  }
}

PreUserCheckin.propTypes = {
  user: PropTypes.object.isRequired,
  team: PropTypes.object.isRequired,
};

export default PreUserCheckin;
