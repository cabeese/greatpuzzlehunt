import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import { Segment, Header, Progress, Button } from 'semantic-ui-react';

import PuzzleProgress from '../../imports/PuzzleProgress';

export default class ActivePuzzle extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { team, puzzle } = this.props;

    return (
      <Segment>
        <Header as='h3' content={ puzzle.name }/>
        <PuzzleProgress puzzle={ puzzle }/>
        <br/>
        <Button
          basic fluid
          color='red'
          content='Reset Timer'
          onClick={ async () => await this._resetTimer() }
        />
      </Segment>
    );
  }

  async _resetTimer() {
    const { team, puzzle } = this.props;
    const confirmMsg = `
You want to reset ${puzzle.name}
for team: ${team.name}?

Are you absolutely positive?
`
    if (!confirm(confirmMsg)) return;

    try {
      await Meteor.callAsync('volunteer.team.resetPuzzle', team._id, puzzle.puzzleId);
    } catch (error) {
      this.setState({ error });
    }
  }
}

ActivePuzzle.propTypes = {
  team: PropTypes.object.isRequired,
  puzzle: PropTypes.object.isRequired,
};
