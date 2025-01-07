import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import { Teams } from '../../../../lib/collections/teams.js';

export default function VolunteerTeamComp(Comp) {
  return withTracker(({ teamId }) => {
    const handle = Meteor.subscribe('volunteer.team', teamId);
    const ready = handle.ready();
    const team = ready ? Teams.findOne(teamId) : null;
    const teamMembers = ready ? Meteor.users.find({ teamId: teamId }).fetch() : [];

    return {
      teamId,
      ready,
      team,
      teamMembers,
    };
  })(Comp);
};
