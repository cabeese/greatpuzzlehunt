import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'semantic-ui-react';

//import AdminTeamEditForm from './AdminTeamEditForm';
import AdminTeamActions from './AdminTeamActions';

class AdminTeamModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: Boolean(props.team),
    };
  }

  componentWillReceiveProps(props) {
    this.setState({ open: Boolean(props.team) });
  }

  render() {
    const { team, clearTeam } = this.props;
    const { open } = this.state;
    if (!open) return null;

    return (
      <Modal
        size="large"
        open={true}
        closeIcon={true}
        onClose={() => clearTeam() }
      >
        <Modal.Header>{team.name}</Modal.Header>
        <Modal.Content>Content</Modal.Content>
        <Modal.Actions>
          <AdminTeamActions
            team={team}
            onToggleCheckedIn={(e) => this._toggleCheckedIn(e)}
          />
        </Modal.Actions>
      </Modal>
    );
  }

  _toggleCheckedIn(e) {
    e.preventDefault();
    const { team } = this.props;
    if (!confirm(`Toggle check-in for team ${team.name}`)) return;

    Meteor.call('team.checkin.toggle', team._id, (err, res) => {
      if (err) {
        alert(err);
        btn.attr('data-content', 'Failed to toggle check-in');
      }
    });
  }
}

AdminTeamModal.propTypes = {
  team: PropTypes.object,
  clearTeam: PropTypes.func.isRequired,
};

export default AdminTeamModal;
