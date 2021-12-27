import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'semantic-ui-react';

class MessageUserModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: Boolean(props.user),
    };
  }

  componentWillReceiveProps(props) {
    this.setState({ open: Boolean(props.user) });
  }

  render() {
    const { user, clearUser } = this.props;
    const { open } = this.state;
    if (!open) return null;

    return (
      <Modal
        size="large"
        open={true}
        closeIcon={true}
        onClose={() => clearUser() }
      >
        <Modal.Header>Message {user.name}</Modal.Header>
          <Modal.Content>
	      <p> Enter your message: </p>
        </Modal.Content>
        <Modal.Actions>
          <AdminUserActions
            user={user}
          />
        </Modal.Actions>
      </Modal>
    );
  }

  _sendPasswordReset(event) {
    const btn = $(event.target);

    Meteor.call('admin.user.resetPassword', { _id: this.props.user._id }, (err, result) => {
      if (err) {
        console.log(err);
        btn.attr('data-content', 'Failed to send password reset email! 😰');
      } else {
        btn.attr('data-content', 'Password Reset Email Sent! 😀');
      }

      btn.popup({
        on: 'manual'
      }).popup('show');

      Meteor.setTimeout(() => {
        btn.popup('hide');
      }, 2500);
    });
  }

  _resendEmailVerification(event) {
    if (!confirm(`Confirm Resend Verification email for "${this.props.user.name}" ?`))
      return;

    const btn = $(event.target);

    Meteor.call('admin.user.emailResend', this.props.user._id, (err, result) => {
      if (err) {
        console.log(err);
        btn.attr('data-content', `Send Failed! 😰 ${err.reason}`);
      } else {
        btn.attr('data-content', 'Email Sent! 😀');
      }

      btn.popup({
        on: 'manual'
      }).popup('show');

      Meteor.setTimeout(() => {
        btn.popup('hide');
      }, 2500);
    });
  }
}

MessageUserModal.propTypes = {
  user: PropTypes.object,
  clearUser: PropTypes.func.isRequired,
};

export default MessageUserModal;
