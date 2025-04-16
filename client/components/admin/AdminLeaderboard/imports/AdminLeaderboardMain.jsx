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
  render() {
    return (
      <Segment basic>
        {this._renderDivisions()}
      </Segment>
    );
  }

  _renderDivisions() {
    const { teams, userIsAdmin } = this.props;
    const teamsByDivision = groupBy(teams, (team) => team.division);
    return Object.keys(teamsByDivision).map((division) => {
      return <AdminLeaderboardDivisionTable userIsAdmin={userIsAdmin}
                                            division={DIVISION_MAP[division]}
                                            teams={teamsByDivision[division]}
                                            key={division} />;
    });
  }
}

AdminLeaderboardMain.propTypes = {
  teams: PropTypes.arrayOf(Object).isRequired,
  userIsAdmin: PropTypes.bool.isRequired,
};

export default AdminLeaderboardMain;
