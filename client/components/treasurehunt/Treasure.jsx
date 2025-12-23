import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container, Message, Statistic } from 'semantic-ui-react';

import GamestateComp from '../imports/GamestateComp';
import TreasureCountdown from './imports/TreasureCountdown';
import TreasureTeamWrapper from './imports/TreasureTeamWrapper';

class TreasureStateWrapper extends Component {
  render() {
    const { ready, gamestate } = this.props;

    console.log('gamestate:');
    console.log(gamestate);

    if (!ready) {
      return <Container><Loading/></Container>;
    }
    else if (!gamestate.treasureplay) {
      return <Container><br/><TreasureCountdown/></Container>;
    }
    return (
      <TreasureTeamWrapper />
    );
  }
}

TreasureStateWrapper.propTypes = {
  ready: PropTypes.bool.isRequired,
  gamestate: PropTypes.object,
};

Treasure = GamestateComp(TreasureStateWrapper);
