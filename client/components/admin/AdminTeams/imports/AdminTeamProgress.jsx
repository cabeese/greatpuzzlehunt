import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data';
import React, { Component } from 'react';
import { Table, Icon, Label, Button } from 'semantic-ui-react'
import moment from 'moment';

AdminTeamProgress = class AdminTeamsProgress extends Component {
    constructor(props){
        super(props);

        // this._userRow = this._userRow.bind(this);
    }

    componentWillUnmount() {
        const { teamHandle } = this.props;
        if (teamHandle) {
            teamHandle.stop();
        }
    }

    _puzzleRow(puzzle) {
        let hintsTaken = [];
        // TODO: we no longer publish the hints to save bandwidth/CPU/etc, so
        // this section has no data to display.
         puzzle.hints.forEach((hint, index) => {
             const name = hint.taken ? "check square" : "square outline";
             hintsTaken.push(<Icon key={index} name={name} />);
         });

        const start = puzzle.start ? moment(puzzle.start).format("HH:mm:ss") : "--";
        const end = puzzle.end ? moment(puzzle.end).format("HH:mm:ss") : "--";

        return (
            <Table.Row key={puzzle.name}>
                <Table.Cell>{puzzle.name}</Table.Cell>
                <Table.Cell>{start}</Table.Cell>
                <Table.Cell>{end}</Table.Cell>
                <Table.Cell>{puzzle.tries || "--"}</Table.Cell>
                <Table.Cell>{hintsTaken}</Table.Cell>
		<Table.Cell> <Icon name={ puzzle.timedOut ? "check square" : "square outline" } /> </Table.Cell>
                <Table.Cell>{puzzle.score || "--"}</Table.Cell>
            </Table.Row>
        )
    }

    render() {
	console.log("in ATP render");
        const {loading, team} = this.props;
	console.log("loading: ", loading);
	console.log("team: ", team);
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
	console.log("puzzles: ", puzzles);

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
    console.log("in ATP tracker setup");
    const {id} = props;
    console.log("id is: ", id);
    const teamHandle = Meteor.subscribe('admin.team.puzzlestatus', id);
    console.log("got team handle");
    const team = Teams.find({ _id: id }).fetch();
    console.log("got team: ", team);
    const loading = !teamHandle.ready();
    console.log("loading: ", loading);

  return { loading, team, teamHandle };
})(AdminTeamProgress);

