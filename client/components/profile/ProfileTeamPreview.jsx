import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Segment, Message, Header, Icon, Button } from 'semantic-ui-react';
import TeamComp from '../imports/TeamComp';

ProfileTeamPreview = class ProfileTeamPreview extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const content = this.props.team ? this._renderWithTeam() : this._renderWithoutTeam();

    return (
      <Segment basic>
        <Header as="h3" icon={<Icon name="users" color="blue"/>} content="Team"/>
        { content }
      </Segment>
    );
  }

  _renderWithTeam() {
    const size = this.props.team.members.length;
    return (
      <Message info>
        <Message.Header>{ this.props.team.name }</Message.Header>
        <Message.Content>
          <p>{ size } team member{ size > 1 ? '' : 's' }.</p>
          <Grid stackable>
            <Grid.Column width={6}>
              <Link to='/team'><Button content='View Team'/></Link>
            </Grid.Column>
            <Grid.Column width={10}>
              <Link to='/looking-for-team'>
                <Button basic color='violet' content='Browse other players looking to join teams!'/>
              </Link>
            </Grid.Column>
          </Grid>
        </Message.Content>
      </Message>
    );
  }

  _renderWithoutTeam() {
    return (
      <NoTeamMessage>
        <ProfileInvites user={ this.props.user }/>
        <p></p>
      </NoTeamMessage>
    );
  }
}

ProfileTeamPreview = TeamComp(ProfileTeamPreview);
