import React from 'react';
import PropTypes from 'prop-types';
import { Segment, Header, Progress, Button } from 'semantic-ui-react';

import UnstartedPuzzle from './UnstartedPuzzle';

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
    const { team, volunteer, puzzle, disabled } = this.props;
    const { complete } = this.state;
    if (complete) {
      const message = puzzle.timedOut ? "Timed out" : "Completed";
      return (
        <Segment>
          <Header as="h3" content={message} />
        </Segment>
      );
    } else {
      return <UnstartedPuzzle
        team={team}
        volunteer={volunteer}
        puzzle={puzzle}
        disabled={disabled}
        showAnswer={false}
      />;
    }
  }
}

InactivePuzzle.propTypes = {
  team: PropTypes.object.isRequired,
  volunteer: PropTypes.object.isRequired,
  puzzle: PropTypes.object.isRequired,
  disabled: PropTypes.bool.isRequired,
};
