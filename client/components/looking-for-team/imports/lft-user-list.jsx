import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, Icon, Button } from 'semantic-ui-react';

import MessageUserModal from '../../message-user/message-user';

class Users extends Component {
    constructor(props) {
	super(props);
	this.setState( { } );
	// Pick up here: need to work out what state to create, and then copy the pattern
	// from AdminUserTable to manage the messageUser state variable that will turn the
	// modal dialog off and on
    }
    
  render() {
    if (!this.props.ready) return <Loading/>

      return (
	  <div>
	      <Card.Group>
		  { this._users() }
	      </Card.Group>
	      <MessageUserModal user={messageUser} clearUser={() => this._clearMessageUser()}/>
	  </div>
      );
  }

  _users() {
    return this.props.users.map((user) => (
      <Card key={user._id}>
        <Card.Content>
          <Card.Header>
            {user.name}
          </Card.Header>
          <Card.Meta>
            { user.bio }
          </Card.Meta>
        </Card.Content>
        <Card.Content extra>
            <Button basic icon='mail' content='Message player' onClick={() => this._messageUser(user)}/>
        </Card.Content>
      </Card>
    ));
  }

    _messageUser(user) {
	console.log('message user: ', user);
    }
}

Users = withTracker(() => {
  const user = Meteor.user();
  const handle = Meteor.subscribe('users.lookingForTeam');
  const ready = handle.ready();
  const users = Meteor.users.find({ _id: { $ne: user._id }, lookingForTeam: true }).fetch();

  return { ready, users };
})(Users);

export default Users;
