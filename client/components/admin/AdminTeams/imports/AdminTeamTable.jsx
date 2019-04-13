import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, Message, Icon } from 'semantic-ui-react';

import AdminTeamTableRow from './AdminTeamTableRow';

class AdminTeamTable extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { loading, teams } = this.props;
    if (loading) return <Loading/>;

    return (
      <div>
        <Table celled striped>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Created</Table.HeaderCell>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Division</Table.HeaderCell>
              <Table.HeaderCell>Checked In</Table.HeaderCell>
              <Table.HeaderCell>Actions</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {this._mapTeams()}
          </Table.Body>
        </Table>
      </div>
    );
  }

  _mapTeams() {
    const { teams } = this.props;
    return teams.map((team) => {
      return (
        <AdminTeamTableRow team={team} key={team._id}/>
      )
    })
  }
}

AdminTeamTable.propTypes = {
  loading: PropTypes.bool.isRequired,
  teams: PropTypes.arrayOf(PropTypes.object),
};

export default AdminTeamTable;
