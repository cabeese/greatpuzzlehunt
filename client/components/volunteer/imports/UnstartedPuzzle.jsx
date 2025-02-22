import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import { Segment, Header, Button, Message } from 'semantic-ui-react';
import { find } from 'lodash';

export default class UnstartedPuzzle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
    };
  }

  render() {
    const { team, puzzle, disabled } = this.props;

    return (
      <Segment disabled={ disabled }>
        <Header as='h3' content={ puzzle.name }/>
        { this._teamMembers(team) }
        { this._startButton() }
        { this._error() }
      </Segment>
    );
  }

    _teamMembers(team) {
	const members = Meteor.users.find({ teamId: team._id }).fetch();
	let checkedin = 0;
	members.forEach(member => {
	    if (member.checkedIn && (member.gameMode == "INPERSON")) {
		checkedin++;
	    }
	});
	let m = (checkedin == 1) ? 'member' : 'members';
	return (
	    <Message info>
		<Message.Header>
		    Team {team.name}
		</Message.Header>
		<Message.Content>
		    <p>{checkedin} team {m} checked in</p>
		</Message.Content>
	    </Message>
	);
    }

  _startButton() {
    const { disabled } = this.props;
    if (disabled) {
      return <Message content='Another Puzzle is being solved'/>;
    } else {
      return <Button
        color='green'
        fluid
        size='large'
        content='Start Timer'
        onClick={ async () => await this._startTimer() }
      />;
    }
  }

  _error() {
    if (!this.state.error) return null;
    return (
      <Message negative
        header='Error'
        content={ this.state.error.reason }
        onDismiss={ () => this.setState({ error: null }) }
      />
    );
  }

  async _startTimer() {
    const { team, puzzle, volunteer } = this.props;
    if (puzzle.puzzleId !== volunteer.puzzleStation) {
      const target = find(team.puzzles, (p) => p.puzzleId === puzzle.puzzleId);
      const volunteerPuzzle = find(team.puzzles, (p) => p.puzzleId === volunteer.puzzleStation);
      const warningMsg = `
Error!
They asked for
"${target.name}"

But, your puzzle station is set to
"${volunteerPuzzle.name}"

You can only start a puzzle time that matches your current active puzzle station!
`
      return;
    }

    try {
      await Meteor.callAsync('volunteer.team.startPuzzle', team._id, puzzle.puzzleId);
    } catch (error) {
      this.setState({ error });
    }
  }
}

UnstartedPuzzle.propTypes = {
  team: PropTypes.object.isRequired,
  volunteer: PropTypes.object.isRequired,
  puzzle: PropTypes.object.isRequired,
};
