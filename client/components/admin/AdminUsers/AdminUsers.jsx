import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { Grid, Container, Input, Menu, Icon, Label, Checkbox } from 'semantic-ui-react';

import DebounceSearch from '../../imports/DebounceSearch';
import AdminUserListTracker from './imports/AdminUserListTracker';

AdminUsers = class AdminUsers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userSearch: '',
      teamSearch: '',
      userFilter: {
        verified: {
          value: false,
          applied: false
        },
        paid: {
          value: false,
          applied: false
        }
      },
    };
  }

  _filterCheckbox(key, label) {
    return (
      <>
      <Checkbox
        label={label}
        onChange={(e, data) => {
          let copy = { ...this.state.userFilter };
          let key_copy = { ...this.state.userFilter[key] };
          key_copy.value = data.checked;

          copy[key] = key_copy

          this.setState({ userFilter: copy });
        }}
      />
      <Checkbox
        label={'Apply ' + key}
        onChange={(e, data) => {
          let copy = { ...this.state.userFilter };
          let key_copy = { ...this.state.userFilter[key] };
          key_copy.applied = data.checked;

          copy[key] = key_copy

          this.setState({ userFilter: copy });
        }}
      />
      </>
    )
  }

  render() {
    const { userSearch, teamSearch, userFilter } = this.state;

    return (
      <Container>
        <PuzzlePageTitle title='Admin: Users'/>

        { this._filterCheckbox('verified', 'Email verified') }
        <br />
        { this._filterCheckbox('paid', 'Paid') }
        <br />
        { this._filterCheckbox('volunteer', 'Volunteer') }
        <br />
        { this._filterCheckbox('onteam', 'On a team') }
        <br /><br />
        <Grid stackable>
          <Grid.Row columns={2}>
            <Grid.Column width={10}>
              <DebounceSearch
                fluid
                icon='search'
                placeholder='Search by First Name, Last Name, or Email'
                delay={350}
                onSearch={(search) => this.setState({ userSearch: search })}
              />
            </Grid.Column>
            <Grid.Column width={6}>
              <DebounceSearch
                fluid
                icon='search'
                placeholder='Search by Team Name'
                delay={350}
                onSearch={(search) => this.setState({ teamSearch: search })}
              />
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column>
              <AdminUserListTracker userSearch={userSearch} teamSearch={teamSearch} userFilter={userFilter}/>
            </Grid.Column>
          </Grid.Row>

        </Grid>

      </Container>
    );
  }
}
