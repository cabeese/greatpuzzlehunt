import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ActivePuzzle from './ActivePuzzle';
import InactivePuzzle from './InactivePuzzle';

class GamePuzzle extends Component {
  render() {
    const { team, user, puzzle } = this.props;

    if (team.currentPuzzle === puzzle.puzzleId) {
      return <ActivePuzzle team={ team } puzzle={ puzzle } />
    } else {
      return <InactivePuzzle team={ team } user={ user } puzzle={ puzzle } disabled={ Boolean(team.currentPuzzle) }/>
    }
  }
}

GamePuzzle.propTypes = {
  team: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  puzzle: PropTypes.object.isRequired,
};

export default GamePuzzle;
