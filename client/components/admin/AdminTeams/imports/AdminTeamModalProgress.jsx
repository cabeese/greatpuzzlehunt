import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Table, Icon } from 'semantic-ui-react';

class AdminTeamModalProgress extends Component {
    _puzzleStats() {
        const { puzzles } = this.props.team;
        if (!puzzles) return "";

        return (
            <Table>
                <Table.Header>
                    <Table.Row>
                        <Table.Cell>Puzzle</Table.Cell>
                        <Table.Cell>Started</Table.Cell>
                        <Table.Cell>Finished</Table.Cell>
                        <Table.Cell>Answer Attempts</Table.Cell>
                        <Table.Cell>Hints Taken</Table.Cell>
                        <Table.Cell>Score</Table.Cell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {puzzles.map(this._puzzleRow)}
                </Table.Body>
            </Table>
        )
    }

    _puzzleRow(puzzle) {
        let hintsTaken = [];
        // TODO: we no longer publish the hints to save bandwidth/CPU/etc, so
        // this section has no data to display.
        // puzzle.hints.forEach((hint, index) => {
        //     const name = hint.taken ? "check square" : "square outline";
        //     hintsTaken.push(<Icon key={index} name={name} />);
        // });
        const start = puzzle.start ? moment(puzzle.start).format("HH:mm:ss") : "--";
        const end = puzzle.end ? moment(puzzle.end).format("HH:mm:ss") : "--";
        return (
            <Table.Row key={puzzle.name}>
                <Table.Cell>{puzzle.name}</Table.Cell>
                <Table.Cell>{start}</Table.Cell>
                <Table.Cell>{end}</Table.Cell>
                <Table.Cell>{puzzle.tries || "(n/a - TODO)"}</Table.Cell>
                <Table.Cell>(n/a - TODO)</Table.Cell>
                <Table.Cell>{puzzle.score || "--"}</Table.Cell>
            </Table.Row>
        )
    }

  render() {
    const { team } = this.props;
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
            <br />
            {this._puzzleStats()}
        </div>
    );
  }
}

AdminTeamModalProgress.propTypes = {
  team: PropTypes.object,
};

export default AdminTeamModalProgress;
