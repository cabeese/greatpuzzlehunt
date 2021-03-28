import { meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import {
  Segment, Header, Grid, Icon, Button, Message, List
} from 'semantic-ui-react';

import CheckInPacket from '../../game/imports/CheckInPacket'; // virtualeventonly

class TeamMemeberCheckIn extends Component {
  render() {
    return (
      <Segment basic>
        {this._checkinConfirmation()}
        <Header as="h2" content="Who is playing today?"/>
        <Grid divided='vertically'>
          {this._renderMembers()}
        </Grid>
      </Segment>
    );
  }

  _unconfirmed(){
    return (
      <Message size="large" info>
        <Message.Header>Awaiting Check In Confirmation</Message.Header>
        <List bulleted>
          <List.Item>Check in your players below.</List.Item>
          <List.Item>Then check in your team with the button at the bottom!</List.Item>
        </List>
      </Message>
    )
  }

  _confirmed(){
    return (
      <Message size="large" positive>
        <Message.Header>Team Check In Confirmed!</Message.Header>
        <CheckInPacket />
        <Link to="/game">
          <Button fluid color="purple" icon="puzzle"
            content="Go To Game" style={{ marginTop: '10px' }} />
        </Link>
      </Message>
    )
  }

  _checkinConfirmation() {
    const { checkinConfirmed: confirmed } = this.props.team;

    return confirmed ? this._confirmed() : this._unconfirmed();
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
