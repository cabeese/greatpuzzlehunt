import { meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Segment, Button, Confirm, Modal,
} from 'semantic-ui-react';

const confirmMessage = "LAST CHANCE!! Your team is set to play virtually, NOT on Western's campus. " +
      "If your team is here in person, DO NOT CHECK YOUR TEAM IN. " +
      "Please talk to someone at the check-in table.";

class TeamCheckInVirtually extends Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmationOpen: false,
      modalOpen: false,
      modalHeader: "",
      modalContent: "",
    }
  }

  showConfirm = () => this.setState({ confirmationOpen: true })
  handleConfirm = () => {
    const self = this;
    const { teamId } = this.props;
    Meteor.call('team.checkin.virtuallyByPlayer', teamId, error => {
      self.setState({ confirmationOpen: false })
      if (error) {
        self.setState({
          modalOpen: true,
          modalHeader: "Failed to check your team :(",
          modalContent: `${error.reason}. If this continues to be a problem, please contact support.`
        });
      } else {
        self.setState({
          modalOpen: true,
          modalHeader: "You are checked in!",
          modalContent: `You may proceed to the game page`
        });
      }
    });

  }
  handleCancelConfirm = () => this.setState({ confirmationOpen: false })
  closeErrorModal = () => this.setState({modalOpen: false});

  render() {
    const {
      confirmationOpen,
      modalOpen,
      modalHeader,
      modalContent
    } = this.state;

    return (
      <Segment basic>
        <Modal open={modalOpen}
          header={modalHeader}
          content={modalContent}
          onClose={this.closeErrorModal}
          actions={[{ key: 'okay', content: 'Okay!', positive: true }]}
          />

        <Button fluid color="green" onClick={this.showConfirm}>
          VIRTUAL Self-Check in
        </Button>
        <Confirm open={confirmationOpen}
          onCancel={this.handleCancelConfirm}
          onConfirm={this.handleConfirm}
          content={confirmMessage}
          confirmButton="We're playing virtually!"
          cancelButton="Cancel"
        />
      </Segment>
    );
  }

}

TeamCheckInVirtually.propTypes = {
  teamId: PropTypes.string.isRequired,
};

export default TeamCheckInVirtually;
