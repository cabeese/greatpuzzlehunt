import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import { Segment, Header, Icon, Button } from 'semantic-ui-react';

import PuzzleQRCode from './PuzzleQrCode';
import PuzzleAnswerForm from './PuzzleAnswerForm';
import PuzzleProgress from '../../imports/PuzzleProgress';
import PuzzleHints from './PuzzleHints';

export default class ActivePuzzle extends React.Component {
  constructor(props) {
    super(props);
  }

  /* Hide the progress bar for non-competitive teams */
  _progress(team, puzzle){
    const isNC = team.division === "noncompetitive";
    if(isNC) return null;

    return <PuzzleProgress puzzle={puzzle} />
  }

  _activePuzzleVirtual(name, downloadURL, embedded){
    return (
      <Button as="a" href={downloadURL} fluid color={embedded ? "grey" : "blue"}
        download={name} target="_blank" size={embedded ? "tiny" : undefined}>
        <Icon name="download" />
        Download Puzzle (PDF)
      </Button>
    );
  }

  _activePuzzleViaQRCode(team, puzzle) {
    return (
      <div>
        <PuzzleQRCode
          team={ team }
          puzzle={ puzzle }
          disabled={ false }
          qrLabel='Show to a Volunteer in case of puzzle emergency'
          qrButtonLabel='Puzzle QR Code'
          color='grey'
          />
        <br />
        {this._activePuzzleVirtual(puzzle.name, puzzle.downloadURL, true)}
      </div>
    );
  }

  _activePuzzle(team, puzzle) {
    const {name, downloadURL} = puzzle;
    if (team.inPerson) {
      return this._activePuzzleViaQRCode(team, puzzle);
    } else {
      return this._activePuzzleVirtual(name, downloadURL, false);
    }
  }

  render() {
    const { team, puzzle } = this.props;

    return (
      <Segment>
        <Header as='h3' content={ puzzle.name }/>
        { this._activePuzzle(team, puzzle) }
        { this._progress(team, puzzle) }
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
