import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card } from 'semantic-ui-react';
import { times } from 'lodash';
import MessageUserModal from '../message-user/message-user';

TeamList = class TeamList extends Component {
  constructor(props) {
    super(props);
    this.state = { messageUser: null };
  }
  
  render() {
    const { messageUser } = this.state;
    return (
      <div>
	<Card.Group>
	  { this._mapTeams() }
	</Card.Group>
	<MessageUserModal user={messageUser} clearUser={() => this._clearMessageUser()}/>
      </div>
    );
  }
  
  _mapTeams() {
    const { teams } = this.props;
    const { messageUser } = this.state;
    const mappedTeams = Array(teams.length);
    times(teams.length, (i) => {
      mappedTeams[i] = <TeamListCard public={this.props.public} team={teams[i]} key={teams[i]._id} messageuser={(user) => this._messageUser(user)}/>;
    });
    return mappedTeams;
  }
  
  _messageUser(user) {
    this.setState({ messageUser: user });
  }
  
  _clearMessageUser() {
    this.setState({ messageUser: null });
  }
}

TeamList.propTypes = {
  teams: PropTypes.array.isRequired,
};
