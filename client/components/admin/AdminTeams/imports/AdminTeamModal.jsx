import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Tab, Button, Icon } from 'semantic-ui-react';

import AdminTeamModalGeneral from './AdminTeamModalGeneral';
import AdminTeamModalProgress from './AdminTeamModalProgress';
import AdminTeamPuzzleEdit from './AdminTeamPuzzleEdit';

class AdminTeamModal extends Component {
  constructor(props) {
    super(props);
    this.state = { selectedPuzzleId: '' };
  }

  _getSelectedPuzzle(pid, team) {
    if (!pid) {
      return null;
    }
    return team.puzzles.find(({ puzzleId }) => puzzleId === pid);
  }
  
  render() {
    const { team, clearTeam } = this.props;
    if (!team) return null;

    const { selectedPuzzleId } = this.state;
    const puzzle = this._getSelectedPuzzle(selectedPuzzleId, team);

    let panes = [
      {
        menuItem: "General",
        render: () => {
          return (
            <Tab.Pane>
              <AdminTeamModalGeneral team={team} />
            </Tab.Pane>
          );
        }
      }
    ];

    if (this._inProgress(team)) {
      panes.push(
	{
          menuItem: "Progress",
          render: () => {
            return (
              <Tab.Pane>
                <AdminTeamModalProgress team={team} selectPuzzle={(puzzleId) => this._selectPuzzle(puzzleId)} />
              </Tab.Pane>
            );
          }
        }
      )
    };
    
    return (
      <div>
	<Modal
	  size="large"
	  open={true}
	  closeIcon={true}
	  onClose={() => clearTeam() }
	>
	  <Modal.Header>{team.name}</Modal.Header>
	  
	  <Modal.Content>
	    <Tab panes={panes} />
	  </Modal.Content>
	  
	  <Modal.Actions>
	    <Button
	      basic
	      onClick={clearTeam}
	      icon={ <Icon name="close" /> }
	      content="Close"
	    />
	  </Modal.Actions>
	</Modal>
	
        <AdminTeamPuzzleEdit team={team} puzzle={puzzle} clearPuzzle={() => this._clearSelectedPuzzle()}/>
      </div>
    );
  }

  _inProgress(team) {
    return (team.hasBegun && team.puzzles && (team.puzzles.length >= 0));
  }

  _selectPuzzle(puzzleId) {
    this.setState({ selectedPuzzleId: puzzleId });
  }

  _clearSelectedPuzzle() {
    this.setState({ selectedPuzzleId: '' });
  }
}

AdminTeamModal.propTypes = {
  team: PropTypes.object,
  clearTeam: PropTypes.func.isRequired,
};

export default AdminTeamModal;
