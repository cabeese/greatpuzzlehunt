import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React, { Component } from 'react';
import { browserHistory } from '../../history';
import { Segment, Header, Card, Button, Icon } from 'semantic-ui-react';
import { map } from 'lodash';
import moment from 'moment';

ProfileInvites = class ProfileInvites extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (!this.props.ready) {
      return <Loading />;
    } else if (this.props.invites.length === 0) {
      return null;
    }
    return this._renderMain();
  }

  _renderMain() {
    return (
      <Segment basic>
        <Header icon={<Icon name='send' color='violet'/>} content="Team Invites"/>
        <Segment basic>
          <Card.Group>
            {this._renderInvites()}
          </Card.Group>
        </Segment>
      </Segment>
    );
  }

  _renderInvites() {
    return map(this.props.invites, (invite) => (
      <Card key={invite._id}>
        <Card.Content>
          <Card.Header>
            {invite.teamName}
          </Card.Header>
          <Card.Meta>
            <strong>Invited By:</strong> {invite.invitedBy.name}
          </Card.Meta>
        </Card.Content>
        <Card.Content extra>
          {moment(invite.updatedAt).calendar()}
          <Button floated='right' icon='reply' color='green' inverted content='Accept' onClick={async () => await this._handleAcceptClick(invite)}/>
        </Card.Content>
      </Card>
    ));
  }

  async _handleAcceptClick(invite) {
    try {
      await Meteor.callAsync('invites.accept', invite);
      browserHistory.push('/team');
    } catch (error) {
      alert(error.reason);
    }
  }
};

ProfileInvites = withTracker(({ user }) => {
  const invitesHandle = Meteor.subscribe('invites.myInvites');
  const ready = invitesHandle.ready();
  const invites = Invites.find({ email: user.getEmail(), accepted: false }).fetch();

  return {
    ready,
    invites,
  };
})(ProfileInvites);
