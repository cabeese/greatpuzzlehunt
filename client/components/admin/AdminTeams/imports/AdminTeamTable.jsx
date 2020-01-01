import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, Message, Icon } from 'semantic-ui-react';
import { find } from 'lodash';

import AdminTeamTableRow from './AdminTeamTableRow';
import AdminTeamModal from './AdminTeamModal';

class AdminTeamTable extends Component {
  constructor(props) {
    super(props);
    this.state = this.stateFromProps(props);
  }

  componentWillReceiveProps(nextProps) {
    this.setState(this.stateFromProps(nextProps, this.state));
  }

  stateFromProps(newProps, currentState = {}) {
    const { loading, teams } = newProps;
    let { selectedTeamId, selectedTeam } = currentState;

    if (selectedTeamId) {
      selectedTeam = find(teams, (t) => (t._id === selectedTeamId));
    }

    return {
      teams,
      selectedTeamId,
      selectedTeam,
    }
  }

  render() {
    const { loading, teams } = this.props;
    if (loading) return <Loading/>;

    const { selectedTeam } = this.state;

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

        <AdminTeamModal team={selectedTeam} clearTeam={() => this._clearSelectedTeam()}/>
      </div>
    );
  }

  _mapTeams() {
    const { teams } = this.props;
    return teams.map((team) => {
      return (
        <AdminTeamTableRow
          team={team}
          key={team._id}
          selectTeam={ () => this._selectTeam(team) }
        />
      )
    })
  }

  _selectTeam(team) {
    this.setState({ selectedTeam: team, selectedTeamId: team._id });
  }

  _clearSelectedTeam() {
    this.setState({ selectedTeam: null });
  }
}

AdminTeamTable.propTypes = {
  loading: PropTypes.bool.isRequired,
  teams: PropTypes.arrayOf(PropTypes.object),
};

export default AdminTeamTable;
