import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data';
import React, { Component } from 'react';
import { Table } from 'semantic-ui-react'

AdminTeamUserList = class AdminTeamsUserList extends Component {
    _userRow(user){
        const { checkedIn } = user;
        return (
            <Table.Row key={user.email}>
                <Table.Cell><em>{user.accountType}</em></Table.Cell>
                <Table.Cell>{user.name}</Table.Cell>
                <Table.Cell positive={checkedIn} negative={!checkedIn}>
                    {checkedIn ? "Checked In" : "NOT Checked In"}
                </Table.Cell>
            </Table.Row>
        )
    }

    _checkinYes(){
        return (
            <Table.Cell positive>
                <Icon name="checkmark" />
                Checked-In
            </Table.Cell>
        )
    }
    _checkinNo(){
        return (
            <Table.Cell negative>
                <Icon name="close" />
                Not Checked-In
            </Table.Cell>
        );
    }

    render() {
        if(!this.props.users || this.props.users.length < 1){
            return (
                <p>Loading user list...</p>
            )
        }

        return (
            <Table celled>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Acct Type</Table.HeaderCell>
                        <Table.HeaderCell>Name</Table.HeaderCell>
                        <Table.HeaderCell>Check-in Status</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {this.props.users.map(this._userRow)}
                </Table.Body>
            </Table>
        );
    }
}
  

export default AdminTeamUserListTracker = withTracker((props) => {
  const {id} = props;
  const userHandle = Meteor.subscribe('admin.team.members', id);
  const users = Meteor.users.find({ teamId: id }).fetch();
  const loading = !userHandle.ready();

  return { loading, users };
})(AdminTeamUserList);
