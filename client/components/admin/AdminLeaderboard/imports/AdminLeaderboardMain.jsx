import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { groupBy } from 'lodash';

import {
  Segment,
  Header,
} from 'semantic-ui-react';

import AdminLeaderboardDivisionTable from './AdminLeaderboardDivisionTable';
import { DIVISION_MAP } from '../../../team/imports/team-helpers';

class AdminLeaderboardMain extends Component {
  constructor(props) {
    super(props);
    this.state = this._stateFromProps(props);
  }

  _stateFromProps(props) {
    const { user, teams } = props;

    return {
      teamsByDivision: groupBy(teams, (team) => team.division),
      user: user,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState(this._stateFromProps(nextProps));
  }

  render() {
    return (
      <Segment basic>
        {this._renderDivisions()}
      </Segment>
    );
  }

  _renderDivisions() {
    const { user, teamsByDivision } = this.state;
    return Object.keys(teamsByDivision).map((division) => {
      return <AdminLeaderboardDivisionTable user={user} division={DIVISION_MAP[division]} teams={teamsByDivision[division]} key={division}/>
    });
  }
}

AdminLeaderboardMain.propTypes = {
  teams: PropTypes.arrayOf(Object).isRequired,
  user: PropTypes.object.isRequired,
};

export default AdminLeaderboardMain;
