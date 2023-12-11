import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, Message, Icon } from 'semantic-ui-react';
import { reduce, find } from 'lodash';

import AdminTeamTableRow from './AdminTeamTableRow';
import AdminTeamModal from './AdminTeamModal';

class AdminTeamTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTeamId: ''
    };
  }

  componentWillUnmount() {
    if (this.props.teamHandle) {
      this.props.teamHandle.stop();
    }
  }

  getSelectedTeam(selectedTeamId, teams){
    if (!selectedTeamId) return null;
    return find(teams, (t) => (t._id === selectedTeamId));
  }

  getTeamCounts() {
    const { teams } = this.props;
    const teamCount = teams.length;
    const inPersonCount = reduce(teams, (acc, team) => {
      if (team.inPerson) {
	acc += 1;
      }
      return acc;
    }, 0);
    const virtualCount = teamCount - inPersonCount;
    return { teamCount, inPersonCount, virtualCount };
  }

  render() {
    const { loading, teams } = this.props;
    if (loading) return <Loading/>;

    const { selectedTeamId } = this.state;
    const selectedTeam = this.getSelectedTeam(selectedTeamId, teams);
    const { teamCount, inPersonCount, virtualCount } = this.getTeamCounts();

    return (
      <div>
	<Message icon>
	  <Icon name="address book" color="teal"/>
	  <Message.Content>
            <Message.Header>
	      Teams Summary
	    </Message.Header>
	    <strong>Total:</strong> {teamCount} &nbsp;
	    <strong>In person:</strong> {inPersonCount} &nbsp;
	    <strong>Virtual:</strong> {virtualCount} &nbsp;
	  </Message.Content>
	</Message>
        <Table celled striped compact>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Created</Table.HeaderCell>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Division</Table.HeaderCell>
              <Table.HeaderCell>Checked In</Table.HeaderCell>
              <Table.HeaderCell>Started?</Table.HeaderCell>
              <Table.HeaderCell>Progress</Table.HeaderCell>
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
          selectTeam={ () => this._selectTeam(team._id) }
        />
      )
    })
  }

  _selectTeam(teamId) {
    this.setState({ selectedTeamId: teamId });
  }

  _clearSelectedTeam() {
    this.setState({ selectedTeamId: '' });
  }
}

AdminTeamTable.propTypes = {
  loading: PropTypes.bool.isRequired,
  teams: PropTypes.arrayOf(PropTypes.object),
};

export default AdminTeamTable;
