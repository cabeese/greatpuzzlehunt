import { meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Container, Divider, Header, Button, Message, Segment
} from 'semantic-ui-react';
import {Link} from 'react-router-dom';

import TeamComp from '../../imports/TeamComp';

import PreUserCheckin from './PreUserCheckin';
import TeamMemberCheckIn from './TeamMemberCheckIn';
import TeamCheckInQRCode from './TeamCheckInQRCode';
import TeamCheckInVirtually from './TeamCheckInVirtually';
import CheckInPacket from '../../game/imports/CheckInPacket';

const {eventYear} = Meteor.settings.public;

class TeamCheckinMain extends Component {
  _step(num) {
    return (
      <Divider horizontal>
        <h1>{num}</h1>
      </Divider>
    );
  }

  _eligibleMessage(team) {
    if (team.prize_ineligible) {
      return(
        <Message icon="warning" size="large" warning header="Ineligible for prizes"
		 content="Your team has been marked ineligible for prizes. There is an issue with your team registration; please contact a volunteer before proceeding." />
      );
    } else {
      return(
	<div> </div>
      );
    }
  }

  _firstStep(team){
    if (team.inPerson) {
      return (
        <div>
          <h2 style={{textAlign: "center"}}>Ensure your entire team is
            <br /><strong>here in person.</strong></h2>

          <small>If you will instead be playing virtually, please change
          this setting on your Team page.</small>

	  {this._eligibleMessage(team)}
        </div>
      );
    } else {
      return (
        <div>
          <h2 style={{textAlign: "center"}}>Ensure your team is set to
            <br /><strong>play virtually!</strong></h2>

          <small>Your team should not be present on the Western campus for
            the game. Please talk to us if you have questions.</small>

	  {this._eligibleMessage(team)}
        </div>
      );
    }
  }

  _checkInButton(team, teamId) {
    if (team.checkinConfirmed) {
      return (
        <Button disabled>Check-in complete!</Button>
      );
    } else if (team.inPerson) {
        return <TeamCheckInQRCode teamId={teamId} />
    } else {
      return <TeamCheckInVirtually teamId={teamId} />
    }
  }

  _checkInComplete(team, teamMembers) {
    return (
      <div>
        <Message positive size="large">
          <Message.Header>Check-In Complete!</Message.Header>

          {team.inPerson ? "" : <CheckInPacket />}

          <Link to="/game">
          <Button fluid color="purple" icon="puzzle"
            content="Go To Game" style={{ marginTop: '10px' }} />
          </Link>
        </Message>
        <Segment>
          <h3>Team Member Status</h3>

          <TeamMemberCheckIn team={team} teamMembers={teamMembers} />
        </Segment>
      </div>
    );
  }

  _postUserCheckin(user, team, teamMembers) {
    return (
      <div>
        {this._step(1)}
        <Segment>
          {this._firstStep(team)}
        </Segment>

        {this._step(2)}
        <Segment>
          <h3>Confirm who is playing</h3>
          <TeamMemberCheckIn team={team} teamMembers={teamMembers}/>
        </Segment>

        {this._step(3)}
        <Segment>
          <h3>Complete check-in!</h3>
          {this._checkInButton(team, user.teamId)}
        </Segment>
      </div>
    );
  }

  _preUserCheckin(user, team) {
    return <PreUserCheckin user={user} team={team}/>;
  }

  _checkInBody(user, team, teamMembers) {
    if (team.checkinConfirmed) {
      return this._checkInComplete(team, teamMembers);
    } else if (team.userCheckin) {
      return this._postUserCheckin(user, team, teamMembers);
    } else {
      return this._preUserCheckin(user, team);
    }
  }

  render() {
    const { ready, user, team, teamMembers } = this.props;

    if (!ready) return <Container><Loading/></Container>;

    if (!user.teamId && !team) {
      return (
        <Message icon="warning" size="large" warning header="Team required!"
          content="You must be on a team in order to check in!" />
      );
    }
    let title = `GPH ${eventYear} Check In`;
    return (
      <Container>
        <PuzzlePageTitle title={title} subTitle={team.name}/>

        {this._checkInBody(user, team, teamMembers)}
      </Container>
    );
  }
}

TeamCheckinMain.propTypes = {
  ready: PropTypes.bool.isRequired,
  user: PropTypes.object,
  team: PropTypes.object,
  teamMembers: PropTypes.arrayOf(Object),
};

export default TeamComp(TeamCheckinMain);
