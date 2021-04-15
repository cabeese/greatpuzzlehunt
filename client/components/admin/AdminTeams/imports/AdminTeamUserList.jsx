import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data';
import React, { Component } from 'react';
import { Table, Icon, Label, Button } from 'semantic-ui-react'

AdminTeamUserList = class AdminTeamsUserList extends Component {
    constructor(props){
        super(props);

        this._userRow = this._userRow.bind(this);
    }

    removeUserFromTeam(userId){
        Meteor.call('admin.user.setTeam', userId, "", error => {
            if(error){
                console.log(error);
                alert(`Failed to remove user from team. ${error.reason}`);
            }
        });
    }

    _userRow(user){
        const { checkedIn } = user;
        const isOwner = this.props.owner == user._id;
        return (
            <Table.Row key={user.email}>
                <Table.Cell>
                    {isOwner ?
                        <Label ribbon>
                            <Icon name="trophy" color="orange" />
                            Owner
                        </Label>
                        : ""
                    }
                    <em>{user.accountType}</em>
                </Table.Cell>
                <Table.Cell>{user.name}</Table.Cell>
                <Table.Cell positive={checkedIn} negative={!checkedIn}>
                    {checkedIn ? "Checked In" : "NOT Checked In"}
                </Table.Cell>
                <Table.Cell>
                    <Button color="red" size="small" disabled={isOwner}
                        onClick={() => this.removeUserFromTeam(user._id)}>
                        <Icon name="x" />Remove
                    </Button>
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
                        <Table.HeaderCell>Remove</Table.HeaderCell>
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
  const {id, owner} = props;
  const userHandle = Meteor.subscribe('admin.team.members', id);
  const users = Meteor.users.find({ teamId: id }).fetch();
  const loading = !userHandle.ready();

  return { loading, users };
})(AdminTeamUserList);
