import { Meteor } from 'meteor/meteor';
import moment from 'moment';
import { getShortName } from '../../lib/imports/util';
import { asBool } from '../../util/parse-env-args';

import { Teams } from '../../lib/collections/teams'
import { Puzzles } from '../../lib/collections/puzzles'

const PUZZLE_WATCHER_IN_MAIN_PROCESS =
      asBool(process.env.PUZZLE_WATCHER_IN_MAIN_PROCESS);

const CHECK_INTERVAL = {
  seconds: 5,
};

async function timeOutPuzzles() {
  const now = moment();
  const teams = await Teams.find({
    division: { $ne: "noncompetitive" },
    currentPuzzle: { $ne: null },
  }).fetchAsync();

  const all_puzzles = await await Puzzles.find({}).fetchAsync()
  const puzzles = all_puzzles.reduce((acc, p) => {
    acc[p._id] = p;
    return acc;
  }, {});

  // TODO: make sure this still works
  teams.forEach(async (team) => {
    const i = team.puzzles.findIndex((p) => (p.puzzleId === team.currentPuzzle));
    const puzzle = team.puzzles[i];

    const allowedTime = { minutes: puzzle.allowedTime };
    const timeOutScore = moment.duration({ minutes: puzzle.timeoutScore }).asSeconds();

    const maxTime = moment(puzzle.start).add(allowedTime);

    if (now.isAfter(maxTime)) {
      // Timeout this puzzle
      const teamNameShort = getShortName(team.name);
      Meteor.logger.info(`Team "${teamNameShort} timed out on puzzle ${puzzle.name}`);
      await Teams.updateAsync(team._id, {
        $set: {
          currentPuzzle: null,
          [`puzzles.${i}.end`]: maxTime.toDate(),
          [`puzzles.${i}.score`]: timeOutScore,
          [`puzzles.${i}.answer`]: puzzles[puzzle.puzzleId].answer,
          [`puzzles.${i}.timedOut`]: true,
        },
      });
    }
  });
}

Meteor.startup(() => {
  if (PUZZLE_WATCHER_IN_MAIN_PROCESS) {
    // On Startup, init Interval for puzzle timeout watcher.
    const interval = moment.duration(CHECK_INTERVAL).asMilliseconds();
    Meteor.logger.warn("Puzzle Watcher logic is running in the main thread. " +
                       "This may cause performance issues in production.");
    Meteor.setInterval(async() => {
      await timeOutPuzzles()
    }, interval);
  } else {
    Meteor.logger.info("Puzzle Watcher logic is NOT running in the main thread. " +
                       "This is expected if a worker process is running.");
  }
});
