import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { Grid, Checkbox, Container, Input, Menu, Icon, Label } from 'semantic-ui-react';

import DebounceSearch from '../../imports/DebounceSearch';
import AdminUserListTracker from './imports/AdminUserListTracker';

AdminUsers = class AdminUsers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userSearch: '',
      teamSearch: '',
      onlyLooking: false
    };
  }

  _handleLookingChange(e, data) {
    const { checked } = data;
    console.log('handleLookingChange, checked: ', checked);
    this.setState({ onlyLooking: checked});
  }

  render() {
    const { userSearch, teamSearch, onlyLooking } = this.state;

    return (
      <Container>
        <PuzzlePageTitle title='Admin: Users'/>

        <Grid stackable>

          <Grid.Row columns={3}>
            <Grid.Column width={8}>
              <DebounceSearch
                fluid
                icon='search'
                placeholder='Search by First Name, Last Name, or Email'
                delay={350}
                onSearch={(search) => this.setState({ userSearch: search })}
              />
            </Grid.Column>
            <Grid.Column width={5}>
              <DebounceSearch
                fluid
                icon='search'
                placeholder='Search by Team Name'
                delay={350}
                onSearch={(search) => this.setState({ teamSearch: search })}
              />
            </Grid.Column>
	    <Grid.Column width={3}>
	      <Checkbox
		toggle
		name='onlyLooking'
		label='Only users looking for team'
		checked={onlyLooking}
		onChange={ (e, data) => this._handleLookingChange(e, data) }
	      />
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column>
              <AdminUserListTracker userSearch={userSearch} teamSearch={teamSearch} onlyLooking={onlyLooking}/>
            </Grid.Column>
          </Grid.Row>

        </Grid>

      </Container>
    );
  }
}
