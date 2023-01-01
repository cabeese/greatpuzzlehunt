import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Segment, Message, Header, Statistic, Progress } from 'semantic-ui-react';

import { renderScore } from '../../imports/PuzzleProgress';
import { getFinalScore } from '../../../../lib/imports/puzzle-helpers';

const { eventYear } = Meteor.settings.public;

class GameStats extends Component {
  _startingPuzzle(team, puzzlesSolved) {
    if (!team.inPerson) return;
    if (puzzlesSolved > 0) return;
    if (!team.startLocation) return;

    return (
      <div>
        <Header as="h4" content="Starting Puzzle (Suggested)" />
        <p>{team.startLocation}</p>
      </div>
    )
  }

  render() {
    const { team } = this.props;
    const puzzlesSolved = team.puzzles.reduce((acc, p) => (acc + (p.score ? 1 : 0)), 0);
    const finished = team.puzzles.length === puzzlesSolved;
    const { time, minutes } = renderScore(getFinalScore(team));

    return (
      <Message info={!finished} positive={finished}>
        {this._startingPuzzle(team, puzzlesSolved)}

        <Header as="h4" content="Puzzles Solved" />
        <p>{puzzlesSolved} of {team.puzzles.length}</p>

        <Header as="h4" content="Total Score" />
        <p>
          {time} <br/>
          ({minutes} minutes)
        </p>

        { this._doneMessage(finished) }
      </Message>
    );
  }

  _doneMessage(finished) {
    if (!finished) return null;
    return (
      <Header as='h3'
        content={`Congratulations! You've finished the ${eventYear} Puzzle Hunt!`}
        subheader="Tune into the webcast or return to Red Square by 5pm PT for prizes."
      />
    );
  }

}

GameStats.propTypes = {
  team: PropTypes.object.isRequired,
};

export default GameStats;
