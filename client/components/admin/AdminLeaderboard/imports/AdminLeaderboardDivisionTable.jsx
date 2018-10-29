import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { groupBy, every, sortBy } from 'lodash';

import {
  Segment,
  Header,
  Table,
  Icon,
} from 'semantic-ui-react';

import { renderScore } from '../../../imports/PuzzleProgress';
import { getHintsTaken } from '../../../../../lib/imports/puzzle-helpers';

const UNFINISHED_OFFSET = 26000;

class AdminLeaderboardDivisionTable extends Component {
  render() {
    const { division, teams } = this.props;

    const sortedTeams = sortBy(teams, (team) => {
      return team.finalScore + (team.finished ? 0 : UNFINISHED_OFFSET);
    });

    return (
      <Segment basic>
        <Header as="h3" content={`Division: ${division}`}/>
        {sortedTeams.length > 0 ? this._renderTable(sortedTeams) : this._noTeams()}
      </Segment>
    );
  }

  _noTeams() {
    return <Message info header="No Teams" content="No teams in this division have started playing"/>;
  }

  _renderTable(teams) {
    const puzzleNames = teams[0].puzzles.map((p) => p.name);
    return (
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Team</Table.HeaderCell>
            <Table.HeaderCell>Size</Table.HeaderCell>
            <Table.HeaderCell>Score</Table.HeaderCell>
            {puzzleNames.map((name) => <Table.HeaderCell key={name}>{name}</Table.HeaderCell>)}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {teams.map((team, i) => this._renderTeamRow(team, i))}
        </Table.Body>
      </Table>
    );
  }

  _renderTeamRow(team, i) {
    const { _id: teamId, name, members, memberIds, puzzles, finalScore, finished } = team;

    return (
      <Table.Row key={teamId}>
        <Table.Cell>{i+1} | {name}</Table.Cell>
        <Table.Cell>{members.length} / {memberIds.length}</Table.Cell>
        <Table.Cell positive={finished} warning={!finished}>
          <code>{renderScore(team.finalScore).time} ({team.finalScore} sec)</code> {!finished ? <Icon name="spinner" color="blue" loading /> : null}
        </Table.Cell>
        {puzzles.map((puzzle) => this._renderPuzzle(puzzle))}
      </Table.Row>
    );
  }

  _renderPuzzle(puzzle) {
    const { score, start, end } = puzzle;
    let hintsTaken = getHintsTaken(puzzle);
    const started = Boolean(start);
    const finished = Boolean(end);
    const inProgress = started && !finished;
    return (
      <Table.Cell key={puzzle.puzzleId} positive={finished} warning={!finished}>
    {finished ? <code>{renderScore(puzzle.score).time} (hints {hintsTaken}) ({puzzle.score} sec)</code> : null }
        {inProgress ? <div><Icon name="spinner" color="blue" loading /> In Progress</div> : null }
        { !started ? <code>--:--:--</code> : null }
      </Table.Cell>
    );
  }
}

AdminLeaderboardDivisionTable.propTypes = {
  division: PropTypes.string.isRequired,
  teams: PropTypes.arrayOf(Object).isRequired,
};

export default AdminLeaderboardDivisionTable;
