import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Container, Segment, Grid, Form, Header, Icon, Message } from 'semantic-ui-react';
import { filter, sortBy as sort } from 'lodash';
import moment from 'moment';

import { browserHistory } from '../../history';

import {DIVISION_TYPES} from './imports/team-helpers';

const DIVISION_OPTS = [
  /* Just throw out all fields other than 'text' and 'value' */
  ...(DIVISION_TYPES.map( ({text, value}) => ({text, value}))),
  /* Add the 'All' sorting option */
  { text: 'All', value: 'all' }
];

// Matchmaking filter options. Allow user to view only teams looking for new
// "strangers" to join them.
const MM_FILTER_OPTS = [
  { text: "All Teams", value: "all" },
  { text: "Recruiting New Members", value: "recruiting" },
];

const SORT_BY_OPTS = [
  { text: 'None', value: 'none' },
  { text: 'Last Updated', value: 'last-updated' },
  { text: 'Team Size', value: 'size' },
  { text: 'Looking for Members', value: 'looking-for-members'},
];
const { eventYear } = Meteor.settings.public;

TeamBrowser = class TeamBrowser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mmFilter: 'all',
      sortBy: 'none',
      division: 'all',
      public: Boolean(this.props.public),
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!this.state.public && nextProps.user && nextProps.user.teamId) {
      browserHistory.push('/team');
    }
  }

  render() {
    return (
      <Container className="section">
        <Segment basic>
          <PuzzlePageTitle title={this._getTitle()} />
          <p>Don't have a team to join? Filter by "Recruiting" teams to find open teams
          looking for players like you!</p>
          <Header as='h3' icon={<Icon name='options' color='violet'/>} content='Options'/>
          <Form>
            <Form.Group widths='equal'>
              <Form.Select label='Filter' name='mmFilter' options={MM_FILTER_OPTS}
                           value={this.state.mmFilter}
                           onChange={(e, data) => this._handleChange(e, data)}/>
              <Form.Select label='Sort By' name='sortBy' options={SORT_BY_OPTS} value={this.state.sortBy} onChange={(e, data) => this._handleChange(e, data)}/>
              <Form.Select label='Division' name='division' options={DIVISION_OPTS} value={this.state.division} onChange={(e, data) => this._handleChange(e, data)}/>
            </Form.Group>
          </Form>
          { this.props.ready ? <TeamList teams={this._getTeams()} public={this.state.public}/> : <Loading /> }
        </Segment>
      </Container>
    );
  }

  _getTitle() {
    return this.state.public ? `${eventYear} Teams` : 'Join a Team';
  }

  _handleChange(e, data) {
    const name = e.target.name || data.name;
    const value = e.target.value || data.value;

    this.setState({ [name]: value });
  }

  _getTeams() {
    const { mmFilter, sortBy, division } = this.state;
    let { teams } = this.props;

    // First filter down teams
    if (division !== 'all') {
      teams = filter(teams, (team) => team.division === division);
    }
    if (mmFilter === "recruiting") {
      teams = filter(teams, team => team.lookingForMembers === true);
    }

    // Then sort filtered results.
    if (sortBy === 'size') {
      teams = sort(teams, (team) => (-team.members.length));
    }
    else if (sortBy === 'last-updated') {
      teams = sort(teams, (team) => (-moment(team.updatedAt).unix()));
    }

    return teams;
  }

}

TeamBrowser = withTracker((props) => {
  const user = Meteor.user();
  const teamsHandle = Meteor.subscribe('teams.browse');
  const ready = teamsHandle.ready();
  // TODO: TEMPORARY FIX - don't list teams without names
  // This is only here because of the Great Check-In Debacle of 2019
  const teams = Teams.find({name: { $exists: true }}).fetch();

  return {
    ready,
    user,
    teams,
  };
})(TeamBrowser);
