import { Meteor } from 'meteor/meteor';
import React, { Component, } from 'react';
import { Button, Icon, Grid } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import AdminTeamUserListTracker from './AdminTeamUserList';

async function callMeteorMethod(methodName, ...args) {
  try {
    await Meteor.callAsync(methodName, ...args);
  } catch (err) {
    alert(err);
  }
}

class AdminTeamModalGeneral extends Component {
    async _toggleCheckedIn(e) {
        e.preventDefault();
        const { team } = this.props;
        if (!confirm(`Toggle check-in for team ${team.name}?`)) return;

        await callMeteorMethod('team.checkin.toggle', team._id);
    }
    async _toggleInPerson(e) {
        e.preventDefault();
        const { team } = this.props;
        if (!confirm(`Toggle in-person for team ${team.name}?`)) return;

        await callMeteorMethod('admin.team.toggleInPerson', team._id);
    }
    async _toggleLockout(e){
        e.preventDefault();
        const { team } = this.props;
        if(!confirm(`Are you SURE you want to toggle the puzzle answer lock team for "${team.name}"?`)) return;

        await callMeteorMethod('admin.team.toggleLockout', team._id);
    }
    async _toggleIneligible(e){
        e.preventDefault();
        const { team } = this.props;
        if(!confirm(`Are you SURE you want to toggle the eligibility status for  team "${team.name}"?`)) return;

        await callMeteorMethod('admin.team.toggleIneligible', team._id);
    }
    render() {
        const { team } = this.props;
        let lookingForMembers = "(unset)";
        if (team.lookingForMembers === true) lookingForMembers = "yes";
        else if (team.lookingForMembers === false) lookingForMembers = "no";

        return (
            <div>
                <Grid columns={3}>
                    <Grid.Column>
                        <strong>Team _id:</strong> {team._id}
                    </Grid.Column>
                    <Grid.Column>
                        <strong> Division:</strong> {team.division}
                    </Grid.Column>
                    <Grid.Column>
                        <strong> Looking for members?</strong> {lookingForMembers}
                    </Grid.Column>
                </Grid>

                <AdminTeamUserListTracker id={team._id} owner={team.owner} />

                <Button
                  label="Manually override this team's in-person setting"
                  color={team.inPerson ? "blue" : "yellow"}
                  onClick={this._toggleInPerson.bind(this)}
                  content={team.inPerson ? "Team playing in-person" : "Team playing virtually"}
                  />
                <br /><br />

                <Button
                    label="Marking a team ineligible indicates they should not be listed on public leaderboards"
                    color={team.prize_ineligible ? 'green' : 'red'}
                    onClick={this._toggleIneligible.bind(this)}
                    icon={<Icon name={team.prize_ineligible ? 'unlock' : 'lock'} />}
                    content={team.prize_ineligible ? "Mark team eligible" : "Mark team ineligible (DANGER)"}
                />
                <br /><br />

                <Button
                    label="Locking a team will prevent them from answering puzzles"
                    color={team.EMERGENCY_LOCK_OUT ? 'green' : 'red'}
                    onClick={this._toggleLockout.bind(this)}
                    icon={<Icon name={team.EMERGENCY_LOCK_OUT ? 'unlock' : 'lock'} />}
                    content={team.EMERGENCY_LOCK_OUT ? "UNLOCK Team" : "LOCK TEAM (DANGER)"}
                />
                <br /><br />

                <Button
                    basic
                    color={team.checkinConfirmed ? 'green' : 'red'}
                    onClick={this._toggleCheckedIn.bind(this)}
                    icon={<Icon name={team.checkinConfirmed ? 'check square' : 'square outline'} />}
                    content={team.checkinConfirmed ? "Undo Check-In" : "Check-in Team"}
                />

            </div>
        );
    }
}

AdminTeamModalGeneral.propTypes = {
    team: PropTypes.object,
};

export default AdminTeamModalGeneral;
