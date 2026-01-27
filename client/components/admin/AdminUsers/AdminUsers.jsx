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
      onlyLooking: false,
      onlyTreasureHunt: false,
      onlyPuzzleHunt: false
    };
  }

  _handleLookingChange(e, data) {
    const { checked } = data;
    this.setState({ onlyLooking: checked});
  }

  _handleOnlyPuzzleChange(e, data) {
    const { checked } = data;
    this.setState({ onlyPuzzleHunt: checked});
  }

  _handleOnlyTreasureChange(e, data) {
    const { checked } = data;
    this.setState({ onlyTreasureHunt: checked});
  }

  render() {
    const { userSearch, teamSearch, onlyLooking, onlyTreasureHunt,
	    onlyPuzzleHunt } = this.state;

    return (
      <Container>
        <PuzzlePageTitle title='Admin: Users'/>

        <Grid stackable>

            <Grid.Column width={8}>
              <DebounceSearch
                fluid
                icon='search'
                placeholder='Search by First Name, Last Name, or Email'
                delay={350}
                onSearch={(search) => this.setState({ userSearch: search })}
              />
            </Grid.Column>
	    <Grid.Column width={8}>
              <DebounceSearch
                fluid
                icon='search'
                placeholder='Search by Team Name'
                delay={350}
                onSearch={(search) => this.setState({ teamSearch: search })}
              />
            </Grid.Column>
	    <Grid.Column width={5}>
	      <Checkbox
		toggle
		name='onlyLooking'
		label='Only users looking for team'
		checked={onlyLooking}
		onChange={ (e, data) => this._handleLookingChange(e, data) }
	      />
            </Grid.Column>
	    <Grid.Column width={5}>
	      <Checkbox
		toggle
		name='onlyPuzzleHunt'
		label='Only users playing Puzzle Hunt'
		checked={onlyPuzzleHunt}
		onChange={ (e, data) => this._handleOnlyPuzzleChange(e, data) }
	      />
            </Grid.Column>
	    <Grid.Column width={5}>
	      <Checkbox
		toggle
		name='onlyTreasureHunt'
		label='Only users playing Treasure Hunt'
		checked={onlyTreasureHunt}
		onChange={ (e, data) => this._handleOnlyTreasureChange(e, data) }
	      />
            </Grid.Column>

          <Grid.Row>
            <Grid.Column>
              <AdminUserListTracker userSearch={userSearch} teamSearch={teamSearch} onlyLooking={onlyLooking} onlyPuzzleHunt={onlyPuzzleHunt} onlyTreasureHunt={onlyTreasureHunt}/>
            </Grid.Column>
          </Grid.Row>

        </Grid>

      </Container>
    );
  }
}
