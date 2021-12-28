import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Form } from 'semantic-ui-react';
import MessageUserActions from './message-user-actions';

class MessageUserModal extends Component {
    constructor(props) {
	super(props);
	this.state = { text: '', user: props.user };
	console.log('messageusermodal, constructor, props user: ', props.user);
    }

    render() {
	const user = this.state.user;
	const open = Boolean(this.state.user);
	console.log('messageusermodal render, user: ', this.state.user, ' open: ', open);
	if (!open) {
	    return null;
	}

	const { text } = this.state;

	return (
	    <Modal
		size="large"
		open={true}
		closeIcon={true}
		onClose={() => this.props.clearUser() }
	    >
		<Modal.Header>Message {user.name}</Modal.Header>
		<Modal.Content>
		    <Form onSubmit={(e) => this._sendMessage(e)}>
			<Form.TextArea label='Message:' placeholder='Text...' name='text' value={text} onChange={this._handleChange} />
			<Form.Button type='submit' content='Send' />
		    </Form>
		</Modal.Content>
	    </Modal>
	);
    }

    _handleChange = (e, { name, value }) => this.setState({ [name]: value })

    _sendMessage(e) {
	console.log('send message', e);
	console.log('message text: ', this.state.text);
	console.log('message destination: ', this.state.user);
	console.log('email addr: ', this.state.user.email.toLowerCase());

	// send the message
	Meteor.call('user.message', this.state.user.email.toLowerCase(), this.state.text, (error, result) => {
	    console.log('send user message callback');
	    console.log('error: ', error);
	    console.log('result: ', result);
	    if (error) {
	 	// XXX handle the error
	    } else {
	 	// close the dialog and clear the mesage
	 	console.log('clearing modal state');
	 	this.props.clearUser();
	 	this.setState({ text: '' });
	    }
	});
    }

    componentDidUpdate(prevProps, prevState) {
	console.log('messageusermodal, component did update');
	console.log('prev props:', prevProps);
	console.log('new props:', this.props);
	if (prevProps.user != this.props.user) {
	    this.setState({ user: this.props.user });
	    console.log('updated state to: ', this.state);
	}
    }
}

MessageUserModal.propTypes = {
    user: PropTypes.object,
    clearUser: PropTypes.func.isRequired,
};

export default MessageUserModal;
