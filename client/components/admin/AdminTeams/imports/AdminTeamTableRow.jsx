import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, Icon, Button, Progress } from 'semantic-ui-react';
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
        <Table.Cell>{this._hasBegun()}</Table.Cell>
        <Table.Cell>{this._progress()}</Table.Cell>
        <Table.Cell>{this._actions()}</Table.Cell>
      </Table.Row>
    );
  }

  _createdAt() {
    const { team } = this.props;
    return moment(team.createdAt).format("MMM Do");
  }

  _name() {
    const maxLen = 30; // TODO: ensure this is a good value. test it
    let { name } = this.props.team;
    if (name.length > maxLen) {
      name = name.substr(0, maxLen) + "..."
    }
    return name;
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
          <Icon name='check square' color='green'/> Checked In
        </span>
      );
    } else {
      return (
        <span>
          <Icon name='square outline' color='red'/> Not Checked In
        </span>
      );
    }
  }

  _hasBegun() {
    return this.props.team.hasBegun ?
      <Icon name='check square' color='green'/> :
      <Icon name="square outline" color='red' />;
  }

  _progress() {
    const { team } = this.props;
    if (!team.hasBegun || !team.puzzles || team.puzzles.length < 1){
      return "--";
    };

    const started = team.puzzles.reduce((acc, puzzle) => {
      return acc + ( puzzle.start ? 1 : 0);
    }, 0);
    const done = team.puzzles.reduce((acc, puzzle) => {
      return acc + ( puzzle.end ? 1 : 0 );
    }, 0);
    const total = team.puzzles.length;

    let color = "teal";
    if (started === 0) color = "black"
    if (done === total) color = "olive"

    return <Progress value={done} total={total}
      progress='ratio' color={color} />
  }

  _actions() {
    const { team, selectTeam } = this.props;
    return (
      <Button basic icon="options" content="More" onClick={() => selectTeam(team)}/>
    );
  }
}

AdminTeamTableRow.propTypes = {
  team: PropTypes.object.isRequired,
  selectTeam: PropTypes.func.isRequired,
};

export default AdminTeamTableRow;
