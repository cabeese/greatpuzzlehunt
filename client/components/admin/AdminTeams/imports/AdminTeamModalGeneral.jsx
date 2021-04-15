import { Meteor } from 'meteor/meteor';
import React, { Component, } from 'react';
import { Button, Icon, Grid } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import AdminTeamUserListTracker from './AdminTeamUserList';

class AdminTeamModalGeneral extends Component {
    _toggleCheckedIn(e) {
        e.preventDefault();
        const { team } = this.props;
        if (!confirm(`Toggle check-in for team ${team.name}?`)) return;

        Meteor.call('team.checkin.toggle', team._id, (err, res) => {
            if (err) {
                alert(err);
            }
        });
    }
    render() {
        const { team } = this.props;

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
                        <strong> Looking for members?</strong> {team.lookingForMembers ? "Yes" : "No"}
                    </Grid.Column>
                </Grid>

                <AdminTeamUserListTracker id={team._id} owner={team.owner} />

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
