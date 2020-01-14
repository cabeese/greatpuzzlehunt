import { meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Container, Header, Icon, Button, Message
} from 'semantic-ui-react';

import TeamComp from '../../imports/TeamComp';

import PreUserCheckin from './PreUserCheckin';
import PostUserCheckin from './PostUserCheckin';

const {eventYear} = Meteor.settings.public;

class TeamCheckinMain extends Component {
  render() {
    const { ready, user, team, teamMembers } = this.props;

    if (!ready) return <Container><Loading/></Container>;

    if (!user.teamId && !team) {
      return (
        <Message icon="warning" size="large" warning header="Team required!" content="You must be on a team in order to check in!" />
      );
    }
    let title = `GPH ${eventYear} Check In`;
    return (
      <Container>
        <PuzzlePageTitle title={title} subTitle={team.name}/>
        {
          team.userCheckin ?
          <PostUserCheckin user={user} team={team} teamMembers={teamMembers}/> :
          <PreUserCheckin user={user} team={team}/>
        }
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
