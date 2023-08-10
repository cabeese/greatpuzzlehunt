import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data';
import React, { Component } from 'react';
import { Table, Icon, Label, Button } from 'semantic-ui-react'
import { renderScore } from '../../../imports/PuzzleProgress';
import moment from 'moment';

AdminTeamProgress = class AdminTeamsProgress extends Component {
  constructor(props){
    super(props);

    this._puzzleRow = this._puzzleRow.bind(this);
  }
  
  componentWillUnmount() {
    const { teamHandle } = this.props;
    if (teamHandle) {
      teamHandle.stop();
    }
  }
  
  _selectPuzzle(puzzle) {
    const { puzzleId } = puzzle;
    const { selectPuzzle } = this.props;
    selectPuzzle(puzzleId);
  }
  
  _puzzleRow(puzzle) {
    let hintsTaken = [];
    puzzle.hints.forEach((hint, index) => {
      const name = hint.taken ? "check square" : "square outline";
      hintsTaken.push(<Icon key={index} name={name} />);
    });
    
    const timedout =  <Icon name={ puzzle.timedOut ? "check square" : "square outline" } />;
    
    const start = puzzle.start ? moment(puzzle.start).format("HH:mm:ss") : "--";
    const end = puzzle.end ? moment(puzzle.end).format("HH:mm:ss") : "--";

    const scoreText = puzzle.score ? "" + renderScore(puzzle.score).time + " (" + puzzle.score.toFixed(1) + " sec)" : "--";
    
    let actions = [];
    if (puzzle.start && puzzle.end) {
      actions.push(
	<Button basic icon="edit" content="Edit" onClick={() => this._selectPuzzle(puzzle)}/>
      );
    }

    return (
      <Table.Row key={puzzle.name}>
        <Table.Cell>{puzzle.name}</Table.Cell>
        <Table.Cell>{start}</Table.Cell>
        <Table.Cell>{end}</Table.Cell>
        <Table.Cell>{puzzle.tries || "--"}</Table.Cell>
        <Table.Cell>{hintsTaken}</Table.Cell>
	<Table.Cell> {timedout} </Table.Cell>
        <Table.Cell>{scoreText}</Table.Cell>
	<Table.Cell>{actions}</Table.Cell>
      </Table.Row>
    )
  }
  
  render() {
    const {loading, team, selectPuzzle} = this.props;
    if (loading) {
      return (
        <p>Loading puzzle information...</p>
      )
    } else if (!team || (team.length < 1)) {
      return (
        <p>No puzzle information to display. (This shouldn't happen)</p>
      )
    }
    
    const { puzzles } = team[0];
    
    return (
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.Cell>Puzzle</Table.Cell>
            <Table.Cell>Started</Table.Cell>
            <Table.Cell>Finished</Table.Cell>
            <Table.Cell>Answer Attempts</Table.Cell>
            <Table.Cell>Hints Taken</Table.Cell>
            <Table.Cell>Timed Out</Table.Cell>
            <Table.Cell>Score</Table.Cell>
            <Table.Cell>Actions</Table.Cell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {puzzles ? puzzles.map(this._puzzleRow) : ""}
        </Table.Body>
      </Table>
    );
  }
}

export default AdminTeamProgressTracker = withTracker((props) => {
  const {id, selectPuzzle} = props;
  const teamHandle = Meteor.subscribe('admin.team.puzzlestatus', id);
  const team = Teams.find({ _id: id }).fetch();
  const loading = !teamHandle.ready();
  
  return { loading, team, teamHandle, selectPuzzle };
})(AdminTeamProgress);

