import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'semantic-ui-react';

import AdminUserEditForm from './AdminUserEditForm';
import AdminUserActions from './AdminUserActions';
import AdminUserTeamChanger from './AdminUserTeamChanger';

class AdminUserModal extends Component {
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
        <Modal.Header>{user.name}</Modal.Header>
        <Modal.Content>
          <AdminUserEditForm user={user}/>
          <br />
          <AdminUserTeamChanger user={user}/>
        </Modal.Content>
        <Modal.Actions>
          <AdminUserActions
            user={user}
            onPasswordReset={async (e) => { await this._sendPasswordReset(e); }}
            onEmailResend={async (e) => { await this._resendEmailVerification(e); }}
            onDelete={async (e) => { await this._deleteUser(e); }}
            onToggleAdmin={async (e) => { await this._toggleRole('admin'); }}
            onToggleVolunteer={async (e) => { await this._toggleRole('volunteer'); }}
            onTogglePaid={async (e) => { await this._togglePaid(e); }}
            onVerifyEmail={async (e) => { await this._verifyEmail(e); }}
          />
        </Modal.Actions>
      </Modal>
    );
  }

  async _sendPasswordReset(event) {
    if (!confirm(`Confirm Send Password Reset for "${this.props.user.name}" ?`))
      return;

    const btn = $(event.target);

    try {
      await Meteor.callAsync('admin.user.resetPassword', { _id: this.props.user._id });
      btn.attr('data-content', 'Password Reset Email Sent! 😀');
    } catch(err) {
        console.log(err);
        btn.attr('data-content', 'Failed to send password reset email! 😰');
    }

    btn.popup({
      on: 'manual'
    }).popup('show');

    Meteor.setTimeout(() => {
      btn.popup('hide');
    }, 2500);
  }

  async _resendEmailVerification(event) {
    if (!confirm(`Confirm Resend Verification email for "${this.props.user.name}" ?`))
      return;

    const btn = $(event.target);

    try {
      await Meteor.callAsync('admin.user.emailResend', this.props.user._id);
      btn.attr('data-content', 'Email Sent! 😀');
    } catch (err) {
      console.log(err);
      btn.attr('data-content', `Send Failed! 😰 ${err.reason}`);
    }

    btn.popup({
      on: 'manual'
    }).popup('show');

    Meteor.setTimeout(() => {
      btn.popup('hide');
    }, 2500);
  }

  async _deleteUser(event) {
    if (!confirm(`Confirm DELETE "${this.props.user.name}" !?!?`))
      return;

    let btn = $(event.target);

    try {
      await Meteor.callAsync('admin.user.delete', this.props.user._id);
    } catch (err) {
      alert(err);
      btn.attr('data-content', 'Failed to delete user! 😰');
    }
  }

  async _toggleRole(role) {
    const { user } = this.props;
    if (!confirm(`Toggle ${role} for ${user.name} ?`)) return;

    try {
      await Meteor.callAsync('admin.user.toggleRole', user._id, role);
    } catch(err) {
      alert(err);
    };
  }

  async _togglePaid(e) {
    e.preventDefault();
    const { user } = this.props;
    if (!confirm(`Toggle Paid for ${user.name} ?`)) return;

    try {
      await Meteor.callAsync('admin.user.togglePaid', user._id);
    } catch (err) {
      alert(err);
    };
  }


  async _verifyEmail(e) {
    e.preventDefault();
    try {
      await Meteor.callAsync('admin.validateUser', this.props.user._id);
    } catch(error) {
      alert(error.reason);
    };
  }
}

AdminUserModal.propTypes = {
  user: PropTypes.object,
  clearUser: PropTypes.func.isRequired,
};

export default AdminUserModal;
