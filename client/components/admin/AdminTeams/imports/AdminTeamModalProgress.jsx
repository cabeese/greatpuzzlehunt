import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Table, Icon } from 'semantic-ui-react';

import AdminTeamProgressTracker from './AdminTeamProgress';

class AdminTeamModalProgress extends Component {
  
  render() {
    const { team, selectPuzzle } = this.props;
    const { puzzles } = team;
    
    if ((puzzles === undefined) || !team.hasBegun) {
      return ( <div> Team has not started game (yet) </div> );
    }

    const puzzlesCt = puzzles.length;
    const puzzlesComplete = puzzles.reduce((acc, puzzle) => {
      return acc + ( puzzle.end ? 1 : 0 );
    }, 0);
    
    return (
      <div>
        {team.hasBegun ? "" : "Team hasn't started game (yet)"}
        <Table collapsing>
          <Table.Body>
            <Table.Row>
              <Table.Cell>
                Started Game At
              </Table.Cell>
              <Table.Cell>
                {moment(team.beganAt).format("LLL")}
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>
                Puzzles Completed
              </Table.Cell>
              <Table.Cell>
                {puzzlesComplete} / {puzzlesCt}
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
	<AdminTeamProgressTracker id={team._id} selectPuzzle={selectPuzzle} />
      </div>
    );
  }
}

AdminTeamModalProgress.propTypes = {
  team: PropTypes.object,
  selectPuzzle: PropTypes.func.isRequired
};

export default AdminTeamModalProgress;
