import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { groupBy, every, sortBy } from 'lodash';
import MaybeNullIcon from '../../../imports/MaybeNullIcon';

import {
  Segment,
  Header,
  Table,
  Icon,
  Popup,
} from 'semantic-ui-react';

import { renderScore } from '../../../imports/PuzzleProgress';
import { getHintsTaken, getFinalScore } from '../../../../../lib/imports/puzzle-helpers';
import { isAdmin } from '../../../../../lib/imports/method-helpers';

const UNFINISHED_OFFSET = 26000;

class AdminLeaderboardDivisionTable extends Component {
  render() {
    const { userIsAdmin, division, teams } = this.props;

    const preSortedTeams = sortBy(teams, (team) => {
      return getFinalScore(team) + (team.finished ? 0 : UNFINISHED_OFFSET);
    });
    const sortedTeams = sortBy(preSortedTeams, team => {
      /* Sort by the number of puzzles completed (not include those that they gave up on) */
      let nComplete = 0;
      team.puzzles.forEach(puzzle => {
        const { gaveUp, end } = puzzle;
        // if(end && !gaveUp) nComplete++;
        if (end) nComplete++;
      });
      return -nComplete;
    });

    return (
      <Segment basic>
        <Header as="h3" content={`Division: ${division}`}/>
        {sortedTeams.length > 0 ?
         this._renderTable(sortedTeams, userIsAdmin) : this._noTeams()}
      </Segment>
    );
  }

  _noTeams() {
    return <Message info header="No Teams" content="No teams in this division have started playing"/>;
  }

  _renderTable(teams, userIsAdmin) {
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
          {teams.map((team, i) => this._renderTeamRow(team, i, userIsAdmin))}
        </Table.Body>
      </Table>
    );
  }

  _renderTeamRow(team, i, userIsAdmin) {
    const { _id: teamId, name, members, memberIds, puzzles, finished, inPerson, prize_ineligible } = team;
    const finalScore = getFinalScore(team);
    let playerCt = members ? members.length : "?";
    const ic = <MaybeNullIcon
      value={inPerson}
      truthy={<Icon name="group" color="blue" />}
      falsey={<Icon name="video" color="yellow" />}
      />;

    const isPrizeIneligible = prize_ineligible ? true : false;
    const dispName = (isPrizeIneligible && !userIsAdmin) ? '(redacted, ineligible)' : name
    const ineligible = <MaybeNullIcon
			 value={isPrizeIneligible && userIsAdmin}
			 truthy={<Icon name='eye slash' color='red' />}
			 falsey={ ' ' }
		       />;

    return (
      <Table.Row key={teamId}>
        <Table.Cell>{i+1} | {dispName} | {ic} {ineligible} </Table.Cell>
        <Table.Cell>{playerCt}</Table.Cell>
        <Table.Cell positive={finished} warning={!finished}>
          <code>{renderScore(finalScore).time} ({finalScore.toFixed(1)} sec)</code>
		  {!finished ? <Popup content="Team has incomplete puzzles" trigger={<Icon name="warning sign" />} /> : null}
        </Table.Cell>
        {puzzles.map((puzzle) => this._renderPuzzle(puzzle))}
      </Table.Row>
    );
  }

  _renderPuzzle(puzzle) {
    const { score, start, end, gaveUp } = puzzle;
    let hintsTaken = getHintsTaken(puzzle);
    const started = Boolean(start);
    const finished = Boolean(end);
    const inProgress = started && !finished;
    return (
      <Table.Cell key={puzzle.puzzleId} positive={finished} warning={!finished}>
        { gaveUp ? <Icon name="ban" color="red" /> : null }
        {finished ? <code>{renderScore(puzzle.score).time} (hints {hintsTaken}) ({puzzle.score.toFixed(1)} sec)</code> : null }
        {inProgress ? <div><Icon name="spinner" color="blue" loading /> In Progress</div> : null }
        { !started ? <code>--:--:--</code> : null }
      </Table.Cell>
    );
  }
}

AdminLeaderboardDivisionTable.propTypes = {
  division: PropTypes.string.isRequired,
  userIsAdmin: PropTypes.bool.isRequired,
  teams: PropTypes.arrayOf(Object).isRequired,
};

export default AdminLeaderboardDivisionTable;
