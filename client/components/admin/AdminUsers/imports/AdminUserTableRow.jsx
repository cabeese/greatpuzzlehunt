import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, Icon, Button } from 'semantic-ui-react';
import MaybeNullIcon from '../../../imports/MaybeNullIcon';
import moment from 'moment';

class AdminUserTableRow extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { user } = this.props;
    if (!user) {
      return <Table.Row negative>MISSING USER!</Table.Row>;
    }

    return (
      <Table.Row>
        <Table.Cell>{this._createdAt()}</Table.Cell>
        <Table.Cell>{this._name()}</Table.Cell>
        <Table.Cell>{this._email()}</Table.Cell>
        <Table.Cell>{this._team()}</Table.Cell>
        <Table.Cell>{this._actions()}</Table.Cell>
      </Table.Row>
    );
  }

  _createdAt() {
    const { user } = this.props;
    return moment(user.createdAt).format("MMM Do");
  }

  _name() {
    const { user } = this.props;
    const { firstname, lastname, gameMode, paid, accountType } = user;
    const fullname = `${firstname} ${lastname}`;
    const gameModeIcon = gameMode ? gameMode === "INPERSON" : null;
    let volunteerIcon = null;
    let adminIcon = null;
    let venueIcon = <MaybeNullIcon value={gameModeIcon}
      truthy={<Icon name="group" color="blue" />}
      falsey={<Icon name="video" color="green" />}
      />;

    if (user.hasRole('volunteer')) {
      volunteerIcon = <Icon name='hand paper' color='teal'/>;
    }

    if (user.hasRole('admin')) {
      adminIcon = <Icon name='spy' color='purple'/>;
    }

    return (
      <span>
        <Icon name='ticket' color={paid ? 'green' : 'yellow'}/>
        {venueIcon}
        {fullname}
        {adminIcon}{volunteerIcon}
      </span>
    );
  }

  _email() {
    const { user } = this.props;
    const icon = user.isVerified() ?
      <Icon name='mail' color='green' />
      :
      <Icon.Group>
        <Icon name="dont" color="yellow" size="large" />
        <Icon name='mail' color='grey' size="small" />
      </Icon.Group>;
    return (
      <span>
        {icon} {user.email}
      </span>
    );
  }

  _emailVerified() {
    return this.props.user.isVerified();
  }

  _team() {
    const { user } = this.props;
    if (!user.teamName && user.lookingForTeam) {
      return (
        <span>
          <Icon name='eye' color='green' /> <i>Looking...</i>
        </span>
      );
    }
    return user.teamName;
  }

  _actions() {
    const { user, selectUser } = this.props;
    return (
      <Button basic icon="options" content="More" onClick={() => selectUser(user)}/>
    );
  }

}

AdminUserTableRow.propTypes = {
  user: PropTypes.object.isRequired,
  selectUser: PropTypes.func.isRequired,
};

export default AdminUserTableRow;
