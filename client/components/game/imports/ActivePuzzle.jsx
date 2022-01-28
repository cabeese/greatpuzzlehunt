import { Meteor } from 'meteor/meteor';
// import React, { PropTypes } from 'react';
import React from 'react';
import PropTypes from 'prop-types';
import { Segment, Header, Icon, Button } from 'semantic-ui-react';

// import PuzzleQRCode from './PuzzleQrCode';
import PuzzleAnswerForm from './PuzzleAnswerForm';
import PuzzleProgress from '../../imports/PuzzleProgress';
import PuzzleHints from './PuzzleHints';

export default class ActivePuzzle extends React.Component {
  constructor(props) {
    super(props);
  }

  /* Hide the progress bar for non-competitive teams */
  _inner(team, puzzle){
    const isNC = team.division === "noncompetitive";
    if(isNC) return null;

    return <PuzzleProgress puzzle={puzzle} />
  }

  render() {
    const { team, puzzle } = this.props;
    const { downloadURL } = puzzle;

    return (
      <Segment>
        <Header as='h3' content={ puzzle.name }/>
        {/* virtualeventonly <PuzzleQRCode
          team={ team }
          puzzle={ puzzle }
          disabled={ false }
          qrLabel='Show to a Volunteer in case of puzzle emergency'
          qrButtonLabel='Puzzle QR Code'
          color='grey'
        /> */}
        <Button as="a" href={downloadURL} fluid color="blue"
          download={puzzle.name} target="_blank">
          <Icon name="download" />
          Download Puzzle (PDF)
        </Button>
        { this._inner(team, puzzle) }
        <PuzzleAnswerForm
          team={ team }
          puzzle={ puzzle }
        />
        <PuzzleHints
          team={ team }
          puzzle={ puzzle }
        />
      </Segment>
    );
  }
}

ActivePuzzle.propTypes = {
  team: PropTypes.object.isRequired,
  puzzle: PropTypes.object.isRequired,
};
