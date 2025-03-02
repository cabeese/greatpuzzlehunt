import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { Container, Divider, Message, Segment } from 'semantic-ui-react';

import PuzzleEditor from './imports/PuzzleEditor';
import PuzzleList from './imports/PuzzleList';
import { CheckinPacketEditor } from './imports/CheckinPacketEditor';
import GamestateControls from '../AdminGamestate/imports/GamestateControls';

AdminPuzzles = class AdminPuzzles extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activePuzzle: null,
    };
  }

  render() {
    return (
      <Container>
        <PuzzlePageTitle title='Puzzles'/>
        <Segment>
          <CheckinPacketEditor />
        </Segment>

        <Segment>
        <PuzzleList
          activePuzzle={this.state.activePuzzle}
          onEdit={ (puzzle) => this._editPuzzle(puzzle) }
          onDelete={ (puzzle) => this._deletePuzzle(puzzle) }
        />
        </Segment>

        <Segment>
          { this._editor() }
        </Segment>
      </Container>
    );
  }

  _editor() {
    const { activePuzzle } = this.state;
    if (!activePuzzle) {
      return <Message info content='Select a puzzle to edit...'/>;
    }
    return (
      <PuzzleEditor
        puzzle={ activePuzzle }
        key={activePuzzle._id}
        closePuzzle={ () => this.setState({ activePuzzle: null }) }
      />
    );
  }

  _editPuzzle(puzzle) {
    this.setState({ activePuzzle: puzzle });
  }

  async _deletePuzzle(puzzle) {
    if (!confirm(`Are you sure you want to delete ${puzzle.name} (${puzzle._id})?`)) return;
    try {
      await Meteor.callAsync('admin.puzzle.delete', puzzle._id);
      console.log(`Deleted puzzle ${puzzle.name} (${puzzle._id})`);
    } catch (error) {
      alert(error.reason);
    }
  }
}
