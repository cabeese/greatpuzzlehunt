import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Icon, Message } from 'semantic-ui-react';

TeamDangerZone = class TeamDangerZone extends Component {
  constructor(props) {
    super(props);
    this.state = {
      success: null,
      error: null,
    };
  }

  render() {
    if (this.props.user._id === this.props.team.owner) {
      return this._renderDeleteTeam();
    } else {
      return this._renderLeaveTeam();
    }
  }

  _renderLeaveTeam() {
    return <Button content='Leave Team' icon='trash' labelPosition='right' color='red'
                   onClick={async () => await this._handleLeaveTeam()}/>;
  }

  async _handleLeaveTeam() {
    if (confirm(`Are you sure you want to leave ${this.props.team.name}?`)) {
      try {
        await Meteor.callAsync('teams.leave');
      } catch (error) {
        alert(error.reason);
      }
    }
  }

  _renderDeleteTeam() {
    return <Button content='Delete Team' icon='trash' labelPosition='right' color='red' onClick={() => this._handleDeleteTeam()}/>;
  }

  async _handleDeleteTeam() {
    if (confirm(`Are you sure you want to delete ${this.props.team.name}?\n(This will remove all members from the team!)`)) {
      try {
        await Meteor.callAsync('teams.delete');
      } catch (error) {
        alert(error.reason);
      }
    }
  }
};

TeamDangerZone.propTypes = {
  team: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
};
