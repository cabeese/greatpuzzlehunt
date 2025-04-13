import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  Container,
  Header,
  Segment,
  Message
} from 'semantic-ui-react';

import AdminLeaderboardTracker from './imports/AdminLeaderboardTracker';
import LeaderboardInternal from './LeaderboardInternal';
import GamestateComp from '../../imports/GamestateComp';
import { isAdmin } from '../../../../lib/imports/method-helpers';

const thinSegmentStyle = {
  marginBottom: '-40px',
  paddingLeft: '28px',
};

AdminLeaderboard = class AdminLeaderboard extends Component {
  render() {
    const { teams, ready, gamestate } = this.props;
    const userIsAdmin = this._userIsAdmin();
    const content = this._getContent();
    return (
      <Container fluid>
        <Segment basic style={thinSegmentStyle}>
          <Header as="h2" content="Leader Board"/>
          {content}
        </Segment>
      </Container>
    );
  }

  _userIsAdmin() {
    const user = Meteor.user();
    // Note: in some cases, the user object may be only partially
    // populated and will be missing the 'roles' array. In this case,
    // we may get a false negative (i.e. admin marked as non-admin)
    // when the page first loads. This is likely not a concern,
    // however, because this check is only used to reveal a few
    // low-impact things, and the component will likely be refreshed
    // with an updated 'user' object almost immediately anyways.
    return !!(user && user.hasRole('admin'));
  }

  _getContent() {
    const { ready, gamestate } = this.props;
    const userIsAdmin = this._userIsAdmin();
    const display = userIsAdmin || (ready && gamestate.leaderboard === true);
    if (!ready) {
      return <Loading />;
    } else if (display) {
      return <LeaderboardInternal userIsAdmin={userIsAdmin} />;
    } else {
      return <Message info content={'Leaderboard is not available yet.'} />;
    }
  }
};

AdminLeaderboard.propTypes = {
  ready: PropTypes.bool.isRequired,
  gamestate: PropTypes.object,
};

AdminLeaderboard = GamestateComp(AdminLeaderboard);
