import { meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Segment, Button, Confirm, Modal,
} from 'semantic-ui-react';

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
          Check in team!
        </Button>
        <Confirm open={confirmationOpen}
          onCancel={this.handleCancelConfirm}
          onConfirm={this.handleConfirm}
          content="Is your team ready to check in?"
          confirmButton="We're ready!"
          cancelButton="Not yet"
        />
      </Segment>
    );
  }

}

TeamCheckInVirtually.propTypes = {
  teamId: PropTypes.string.isRequired,
};

export default TeamCheckInVirtually;
