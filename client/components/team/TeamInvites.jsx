import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Card, Icon, Button, Message } from 'semantic-ui-react';
import moment from 'moment';

import { Invites } from '../../../lib/collections/invites.js';

TeamInvites = class TeamInvites extends Component {
  constructor(props) {
    super(props);
    this.state = {
      success: null,
      error: null,
    };
  }

  render() {
    if (this.props.ready) {
      return (
        <Card.Group>
          {this._renderInvites()}
          <Message
           negative
           hidden={!this.state.error}
           icon="warning sign"
           onDismiss={() => this.setState({ error: null })}
           content={this.state.error ? this.state.error.reason : ''}
          />
          <Message
           positive
           hidden={!this.state.success}
           icon="check"
           onDismiss={() => this.setState({ success: null })}
           content={this.state.success}
          />
        </Card.Group>
      );
    }
    return <Loading />;
  }

  _renderInvites() {
    return this.props.invites.map((invite) => (
      <Card key={invite._id}>
        <Card.Content>
          <Card.Header>
            {invite.email}
          </Card.Header>
          <Card.Meta>
            Sent: {moment(invite.updatedAt).calendar()}
          </Card.Meta>
        </Card.Content>
        <Card.Content extra>
          <Button floated='left' icon='mail' color='green' inverted content='Resend' onClick={async () => await this._handleResendClick(invite.email)}/>
          <Button floated='right' icon='trash' color='red' inverted content='Delete' onClick={async () => await this._handleDeleteClick(invite.email)}/>
        </Card.Content>
      </Card>
    ));
  }

  async _handleResendClick(email) {
    try {
      await Meteor.callAsync('teams.inviteMember', this.props.team, email);
      this.setState({ success: `Invite resent to ${email}` });
      Meteor.setTimeout(() => {
        this.setState({ success: null });
      }, 6000);
    } catch (error) {
      this.setState({ error });
    }
  }

  async _handleDeleteClick(email) {
    try {
      await Meteor.callAsync('teams.deleteInvite', this.props.team, email);
      this.setState({ success: `Invite for ${email} has been deleted!` });
      Meteor.setTimeout(() => {
        this.setState({ success: null });
      }, 6000);
    } catch (error) {
      this.setState({ error });
    }
  }
};

TeamInvites = withTracker(({ team }) => {
  const invitesHandle = Meteor.subscribe('teams.invites');
  const ready = invitesHandle.ready();
  const invites = Invites.find({ teamId: team._id, accepted: false }).fetch();

  return {
    ready,
    invites,
  };
})(TeamInvites);
