import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { groupBy, every } from 'lodash';

import { Teams } from '../../../../../lib/collections/teams.js'

export default function AdminLeaderboardTracker(Comp) {
  return withTracker((props) => {
    const handle = Meteor.subscribe('admin.leaderboard');
    const ready = handle.ready();

    const teams = ready ? Teams.find({ hasBegun: true }).fetch() : [];

    teams.forEach((team) => {
      team.finished = every(team.puzzles, (puzzle) => Boolean(puzzle.end));
    });

    return {
      ready: ready,
      teams,
    };

  })(Comp);
};
