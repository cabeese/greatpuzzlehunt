// import React, { PropTypes } from 'react';
import React from 'react';
import PropTypes from 'prop-types';
import { Segment, Header, Progress, Button } from 'semantic-ui-react';

import UnstartedPuzzleVirtual from './UnstartedPuzzleVirtual';
import CompletePuzzle from '../../imports/CompletePuzzle';

export default class InactivePuzzle extends React.Component {
  constructor(props) {
    super(props);
    const { team, puzzle } = props;
    this.state = {
      complete: Boolean(puzzle.score),
      showQRcode: false,
    };
  }

  render() {
    const { team, user, puzzle, disabled } = this.props;
    const { complete } = this.state;
    if (complete) {
      return <CompletePuzzle
        team={ team }
        puzzle={ puzzle }
        disabled={ disabled }
        showAnswer={ true }
      />;
    } else {
      return <UnstartedPuzzleVirtual
        team={ team }
        user={ user }
        puzzle={ puzzle }
        disabled={ disabled }
      />;
    }
  }
}

InactivePuzzle.propTypes = {
  team: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  puzzle: PropTypes.object.isRequired,
  disabled: PropTypes.bool.isRequired,
};
