import { meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
  Segment, Header, Grid, Icon, Button, Message, List
} from 'semantic-ui-react';

class TeamMemeberCheckIn extends Component {
  render() {
    return (
      <div>
        <Grid divided='vertically'>
          {this._renderMembers()}
        </Grid>
      </div>
    );
  }

  _renderMembers() {
    const { teamMembers } = this.props;
    return teamMembers.map((member, i) => this._renderMember(member, i))
  }

  _renderMember(member, i) {
    const { name, paid, checkedIn, _id: userId } = member;
    const { checkInConfirmed } = this.props.team;
    return (
      <Grid.Row columns={2} key={userId}>
        <Grid.Column>
          <Header as="h4" content={name}/>
          <Button disabled={!paid || checkInConfirmed} basic={checkedIn} color={checkedIn ? "grey" : "green"} content={checkedIn ? "Cancel" : "Here!"} onClick={() => this._toggleCheckin(userId)}/>
        </Grid.Column>
        <Grid.Column>
          <Icon name={checkedIn ? "check" : "remove"} color={checkedIn ? 'green' : 'yellow'} size="large" /> {this._message(paid, checkedIn)}
        </Grid.Column>
      </Grid.Row>
    );
  }

  _message(paid, checkedIn) {
    if (!paid) return "Needs Ticket";
    else if (checkedIn) return "Ready";
    else return "Not here";
  }

  _toggleCheckin(userId) {
    Meteor.call('team.checkin.user', userId, (error, result) => {
      if (error) alert(error.reason);
    });
  }
}

TeamMemeberCheckIn.propTypes = {
  team: PropTypes.object.isRequired,
  teamMembers: PropTypes.arrayOf(Object).isRequired,
};

export default TeamMemeberCheckIn;
