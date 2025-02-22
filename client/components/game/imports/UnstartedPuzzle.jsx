import React from 'react';
import PropTypes from 'prop-types';
import { Segment, Header, Button } from 'semantic-ui-react';

import PuzzleQRCode from './PuzzleQrCode';

export default class UnstartedPuzzle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showQRcode: false,
    };
  }

  render() {
    const { team, puzzle, disabled } = this.props;
    const startUrl = `${window.location.origin}/volunteer/time/${team._id}/${puzzle.puzzleId}`;
    return (
      <Segment disabled={ disabled }>
        <Header as='h3' content={puzzle.name} subheader={puzzle.location}/>

        <PuzzleQRCode
          team={ team }
          puzzle={ puzzle }
          disabled={ disabled }
          qrLabel="Present to volunteer to start puzzle"
          qrButtonLabel='Start Puzzle!'
        />
      </Segment>
    );
  }
}

UnstartedPuzzle.propTypes = {
  team: PropTypes.object.isRequired,
  puzzle: PropTypes.object.isRequired,
  disabled: PropTypes.bool.isRequired,
};
