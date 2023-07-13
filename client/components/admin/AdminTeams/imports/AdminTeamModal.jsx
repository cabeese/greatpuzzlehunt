import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Tab, Button, Icon } from 'semantic-ui-react';

//import AdminTeamEditForm from './AdminTeamEditForm';
import AdminTeamModalGeneral from './AdminTeamModalGeneral';
import AdminTeamModalProgress from './AdminTeamModalProgress';

class AdminTeamModal extends Component {
  render() {
    const { team, clearTeam } = this.props;
    if (!team) return null;

      console.log("admin team modal:");
      console.log(team);

    const paneMap = {
      "General": AdminTeamModalGeneral,
      "Progress": AdminTeamModalProgress,
    };
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
              <AdminTeamModalProgress team={team} />
            </Tab.Pane>
          );
        }
      }
	  )
      };

    return (
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
    );
  }

    _inProgress(team) {
	return (team.hasBegun && team.puzzles && (team.puzzles.length >= 0));
    }

}

AdminTeamModal.propTypes = {
  team: PropTypes.object,
  clearTeam: PropTypes.func.isRequired,
};

export default AdminTeamModal;
