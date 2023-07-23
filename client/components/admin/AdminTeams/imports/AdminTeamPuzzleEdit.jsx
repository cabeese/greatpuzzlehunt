import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Tab, Button, Icon } from 'semantic-ui-react';

class AdminTeamPuzzleEdit extends Component {
  constructor(props) {
    super(props);
    this.state = { selectedPuzzleId: '' };
  }
  
  render() {
    console.log("ATPE render");
    const { team, puzzle, clearPuzzle } = this.props;
    console.log("team: ", team);
    console.log("puzzle: ", puzzle);
    console.log("clearPuzzle: ", clearPuzzle);
    if (!team || !puzzle) {
      return null;
    }
    console.log("ATPE render actually rendering");
    
    return (
      <div>
	This is the ATP!
	<Modal
          size="large"
          open={true}
          closeIcon={true}
          onClose={() => clearPuzzle() }
	>
          <Modal.Header>{team.name}: Puzzle {puzzle.name}</Modal.Header>
	  
          <Modal.Content>
            xyzzy
          </Modal.Content>
	  
          <Modal.Actions>
            <Button
              basic
              onClick={clearPuzzle}
              icon={ <Icon name="close" /> }
              content="Close"
            />
          </Modal.Actions>
	</Modal>
      </div>
    );
  }
}

AdminTeamPuzzleEdit.propTypes = {
  team: PropTypes.object,
  puzzle: PropTypes.object,
  clearPuzzle: PropTypes.func.isRequired,
};

export default AdminTeamPuzzleEdit;
