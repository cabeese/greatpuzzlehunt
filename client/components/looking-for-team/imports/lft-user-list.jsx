import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, Icon, Button } from 'semantic-ui-react';

import MessageUserModal from '../../message-user/message-user';

class Users extends Component {
  constructor(props) {
    super(props);
    this.state = { messageUser: null };
  }
  
  render() {
    if (!this.props.ready) {
      return <Loading/>;
    }

    const { messageUser } = this.state;
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
    if (!this.props.users || this.props.users.length === 0) {
      return (
        <span>There are currently no players looking to join a team.</span>
      );
    }
    return this.props.users.map((user) => (
      <Card key={user._id}>
	<Card.Content>
	  <Card.Header>
	    {user.firstname} {user.lastname}
	  </Card.Header>
	  <Card.Meta>
	    { user.bio }
	  </Card.Meta>
	</Card.Content>
	<Card.Content extra>
          { this._mailButton(user) }
	</Card.Content>
      </Card>
    ));
  }

  _mailButton(user) {
    const own_id = this.props.this_user._id;
    if (user._id == own_id) {
      return "";
    }
    return <Button basic icon='mail' content='Message player'
                   onClick={() => this._messageUser(user)}/>
  }

  _messageUser(user) {
    this.setState({ messageUser: user });
  }

  _clearMessageUser() {
    this.setState({ messageUser: null });
  }
}

Users = withTracker(() => {
  const this_user = Meteor.user();
  const handle = Meteor.subscribe('users.lookingForTeam');
  const ready = handle.ready();
  const users = Meteor.users.find({lookingForTeam: true }).fetch();

  return { ready, users, this_user };
})(Users);

export default Users;
