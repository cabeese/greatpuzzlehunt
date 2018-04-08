import { meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Container, Header, Message, Icon
} from 'semantic-ui-react';

import GamestateComp from '../imports/GamestateComp';
import TeamCheckinMain from './imports/TeamCheckinMain';

class TeamCheckinInner extends Component {
  render() {
    const { ready, gamestate } = this.props;
    if (!ready) return <Container><Loading /></Container>;

    return (
      <Container>
        <PuzzlePageTitle title="Welcome!"/>
        {gamestate.checkin ? this._renderCheckin() : this._renderCheckinClosed() }
      </Container>
    );
  }

  _renderCheckin() {
    return <TeamCheckinMain />
  }

  _renderCheckinClosed() {
    return (
      <Container>
        <Message icon={<Icon loading name="refresh"/>} info header="Waiting or Check In to open"/>
      </Container>
    );
  }
}

TeamCheckinInner.propTypes = {
  ready: PropTypes.bool.isRequired,
  gamestate: PropTypes.object,
};

TeamCheckin = GamestateComp(TeamCheckinInner);
