import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, Icon, Button } from 'semantic-ui-react';
import moment from 'moment';

class AdminTeamTableRow extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { team } = this.props;
    if (!team) {
      return <Table.Row negative>MISSING TEAM!</Table.Row>;
    }

    return (
      <Table.Row>
        <Table.Cell>{this._createdAt()}</Table.Cell>
        <Table.Cell>{this._name()}</Table.Cell>
        <Table.Cell>{this._division()}</Table.Cell>
        <Table.Cell>{this._checkedIn()}</Table.Cell>
        <Table.Cell>{this._actions()}</Table.Cell>
      </Table.Row>
    );
  }

  _createdAt() {
    const { team } = this.props;
    return moment(team.createdAt).format("MMM Do");
  }

  _name() {
    const { team } = this.props;
    return team.name;
  }

  _division() {
    const { team } = this.props;
    return team.division;
  }

  _checkedIn() {
    const { team } = this.props;
    
    if (team.checkinConfirmed) {
      return (
        <span>
          <Icon name='thumbs up' color='green'/> Checked In
        </span>
      )
    } else {
      return (
        <span>
          <Icon name='thumbs down' color='red'/> Not Checked In
        </span>
      )
    }
  }

  _actions() {
    const { team } = this.props;
    return (
      <Button basic icon="options" content="More"/>
    )
  }
}

AdminTeamTableRow.propTypes = {
  team: PropTypes.object.isRequired,
};

export default AdminTeamTableRow;
