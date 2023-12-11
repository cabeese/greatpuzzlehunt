import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, Icon, Label, Button, Progress } from 'semantic-ui-react';
import MaybeNullIcon from '../../../imports/MaybeNullIcon';
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
    const { EMERGENCY_LOCK_OUT, prize_ineligible } = team;

    const isPrizeIneligible = prize_ineligible ? true : false;
    const ineligible = <MaybeNullIcon
			 value={isPrizeIneligible}
			 truthy={<Icon name='eye slash' color='red' />}
			 falsey={ ' ' }
		       />;

    return (
      <Table.Row error={EMERGENCY_LOCK_OUT}>
        <Table.Cell>{this._createdAt()}</Table.Cell>
        <Table.Cell>{this._name()} {ineligible}</Table.Cell>
        <Table.Cell>{this._division()}</Table.Cell>
        <Table.Cell>{this._checkedIn()}</Table.Cell>
        <Table.Cell>{this._hasBegun()} {this._lockout(EMERGENCY_LOCK_OUT)}</Table.Cell>
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
    const { division, inPerson } = this.props.team;
    const ic = <MaybeNullIcon
      value={inPerson}
      truthy={<Icon name="group" color="blue" />}
      falsey={<Icon name="video" color="yellow" />}
      />;
    return (
      <span>
        {ic}
        <strong> | </strong>
        {division}
      </span>
    );
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

  _lockout(locked){
    return locked ? <Icon name="attention" /> : "";
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
    const active = started > done;
    const completed = done == total;

    if (completed) {
      return (
        <div>
          <Icon name="star" color="yellow" /> Done!
        </div>
      )
    } else {
      return (
        <div>
          <Label>
            <Icon name="check square" /> {done}
          </Label>&nbsp;
          { active ?
            <Icon name="redo" loading />
            :
            ""
          }
        </div>
      );
    }
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
