import { Meteor } from 'meteor/meteor'
import React, { Component } from 'react';
import { Grid, Container, Input, Menu, Icon, Label } from 'semantic-ui-react';

import AdminTeamListTracker from './imports/AdminTeamListTracker'

AdminTeams = class AdminTeams extends Component {
  constructor(props) {
    super(props);
    this.state = {
      teamSearch: '',
    };
  }

  render() {
    return (
      <Container>
        <PuzzlePageTitle title='Admin: Teams' />
        <Grid stackable>
          <Grid.Row>
            <Grid.Column>
              <AdminTeamListTracker  />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    );
  }
}
