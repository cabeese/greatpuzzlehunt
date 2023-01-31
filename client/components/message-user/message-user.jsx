import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Form, Message, Icon, } from 'semantic-ui-react';

class MessageUserModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '', user: props.user, error: null,
      loading: false,
      didSend: false,
    };
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
	    <Form.TextArea label='Message:' placeholder="Hi, I'm looking to join a team. My background is in..."
                     name='text' value={text} onChange={this._handleChange}
                     disabled={this.state.loading || this.state.didSend} />
	    <Form.Group>
	      <Form.Button color='green' type='submit' content='Send'
                     disabled={this.state.loading || this.state.didSend} />
	      <Form.Button floated='right' color='red' inverted type='submit' content='Cancel'
                     onClick={(e) => { e.preventDefault(); this._clearState(); }}
                     disabled={this.state.loading} />
	    </Form.Group>
	    <p>Clicking "Send" will share your email address and the message above with the team captain.</p>
	    <Message negative
		     hidden={!this.state.error}
		     icon='warning sign'
		     content={this.state.error ? this.state.error : ''}
	    />
	    <Message positive hidden={!this.state.didSend}>
        <Icon name="check" />
        Message Sent!<br /><br />
        <Button color="blue" onClick={(e) => { e.preventDefault(); this._clearState(); }}>
          Close
        </Button>
      </Message>
	  </Form>
	</Modal.Content>
      </Modal>
    );
  }

  _handleChange = (e, { name, value }) => this.setState({ [name]: value })

  _sendMessage(e) {
    // send the message
    this.setState({loading: true});
    Meteor.call('user.matchmaking-message', this.state.user.email.toLowerCase(), this.state.text, (error, result) => {
      if (error) {
	      this.setState({
          error: error.message,
          loading: false,
        });
      } else {
        this.setState({didSend: true, loading: false});
      }
    });
  }

  _clearState() {
    this.props.clearUser();
    this.setState({ text: '', error: null, loading: false, didSend: false, });
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
