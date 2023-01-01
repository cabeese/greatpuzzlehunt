import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Form, Message } from 'semantic-ui-react';

class MessageUserModal extends Component {
  constructor(props) {
    super(props);
    this.state = { text: '', user: props.user, error: null };
  }

  render() {
    const user = this.state.user;
    const open = Boolean(this.state.user);
    if (!open) {
      return null;
    }

    const { text } = this.state;

    return (
      <Modal
	size="large"
	open={true}
	closeIcon={true}
	onClose={() => this._clearState() }
      >
	<Modal.Header>Message {user.name}</Modal.Header>
	<Modal.Content>
	  <Form onSubmit={(e) => this._sendMessage(e)}>
	    <Form.TextArea label='Message:' placeholder='Text...' name='text' value={text} onChange={this._handleChange} />
	    <Form.Group>
	      <Form.Button color='green' type='submit' content='Send' />
	      <Form.Button floated='right' color='red' inverted type='submit' content='Cancel' onclick={() => this._clearState() } />
	    </Form.Group>
	    <p> This will send an email message to the player. The email message will include your message and email address for them to reply to you.</p>
	    <Message negative
		     hidden={!this.state.error}
		     icon='warning sign'
		     content={this.state.error ? this.state.error : ''}
	    />
	  </Form>
	</Modal.Content>
      </Modal>
    );
  }

  _handleChange = (e, { name, value }) => this.setState({ [name]: value })

  _sendMessage(e) {
    // send the message
    Meteor.call('user.matchmaking-message', this.state.user.email.toLowerCase(), this.state.text, (error, result) => {
      if (error) {
	// handle the error
	this.setState({ error: error.message });
      } else {
	// close the dialog and clear the mesage
	this._clearState();
      }
    });
  }

  _clearState() {
    this.props.clearUser();
    this.setState({ text: '', error: null });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.user != this.props.user) {
      this.setState({ user: this.props.user });
    }
  }
}

MessageUserModal.propTypes = {
  user: PropTypes.object,
  clearUser: PropTypes.func.isRequired
};

export default MessageUserModal;
