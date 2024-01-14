import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import {
  Header,
  Form,
  Icon,
  Message,
} from 'semantic-ui-react';

class AdminUserTeamChanger extends Component {
  constructor(props) {
    super(props);
    this.state = this._stateFromProps(props);
  }

  _stateFromProps(props) {
    const {_id, teamId} = props.user;
    return {
      userId: _id,
      teamId: teamId || ""
    }
  }

  componentWillReceiveProps(props) {
    this.setState(this._stateFromProps(props));
  }

  render() {
    const { teamId } = this.state;
    const { lookingForTeam } = this.props.user;
    let matchmaking_status = "(unset)";
    if (lookingForTeam === true) matchmaking_status = "looking";
    else if (lookingForTeam === false) matchmaking_status = "no longer looking";

    return (
      <Form onSubmit={(e) => this._update(e)}>

        {this._errorMessage()}

        <Header as='h3' icon={<Icon name='user' color='blue' />} content='Team' subheader='This section should be replaced by the Team Edit interface later' />

        <span>
          <u>Matchmaking status:</u> {matchmaking_status}
        </span>

        <Form.Group widths='equal'>
          <Form.Input name='teamId' label='teamId' value={teamId} onChange={(e) => this._handleTextChange(e)} />
        </Form.Group>

        <Form.Button fluid type='submit' content='Update Team Only' color='green' />
      </Form>
    );
  }

  _update(e) {
    e.preventDefault();
    const {userId, teamId} = this.state;

    Meteor.call('admin.user.setTeam', userId, teamId, (error, result) => {
      if (error) return this.setState({ error });
      this.setState({ error: null });
      alert(`Team updated for this user!`);
    });
  }

  _handleTextChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  _errorMessage() {
    if (!this.state.error) return null;
    return <Message negative
      icon='warning'
      title='There were issues registering!'
      content={this.state.error.reason}
      onDismiss={(e) => this.setState({ error: null })} />
  }
}

export default AdminUserTeamChanger;
