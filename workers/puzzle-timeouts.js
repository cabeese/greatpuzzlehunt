const { MongoClient } = require('mongodb');
const moment = require('moment');

const MONGO_URL = process.env.MONGO_URL;
// Number of times the RunLoop can fail before we give up.
const ERROR_MAX = 5;

const sleep = delay_ms => {
  return new Promise((resolve) => setTimeout(resolve, delay_ms));
}

// =============================================================================
// Database Connections
// =============================================================================

function establishClient() {
  console.log("Establishing watcher's MongoDB connection...");
  return new MongoClient(MONGO_URL);
}

async function getGamestate(db) {
  return await db.collection("gamestate").findOne();
}

async function gameIsInPlay(db) {
  const gamestate = await getGamestate(db);
  return gamestate.gameplay;
}

async function getPuzzles(db) {
  const all_puzzles = await db.collection("puzzles").find().toArray();
  // Put the puzzles in a map in the form { _id: <puzzle> }
  const puzzles = all_puzzles.reduce((acc, p) => {
    acc[p._id] = p;
    return acc;
  }, {});
  return puzzles;
}

async function getActiveTeams(db) {
  return await db.collection("teams")
    .find({ currentPuzzle: { $ne: null } })
    .project({ currentPuzzle: 1, name: 1, puzzles: 1})
    .toArray();
}

// =============================================================================
// Game Logic
// =============================================================================

// Counter for loop iterations for (temporary?) monitoring purposes.
let DEBUG_iter_ct = 0;

async function timeOutTeams(puzzles_cached, db) {
  const teams = await getActiveTeams(db);
  const now = moment();

  // Unless teams are actively timing out, there's little to no
  // indication that this watcher process is active. In lieu of proper
  // metrics and monitoring (which can hopefully be added at some
  // point), we can add a log line every so often so we have
  // confidence that this logic is being executed.
  if (++DEBUG_iter_ct % (60 * 5) === 0) {
    console.debug(`Watcher monitoring ${teams.length} active teams`);
  }

  // Note that Errors thrown in the lambda will cause the entire
  // worker to crash and will not be handled by any of the error
  // handling code surrounding this function. We try to catch errors
  // where we expect they can be thrown, and simply 'return' instead.
  teams.forEach(async team => {
    const i = team.puzzles.findIndex((p) => (p.puzzleId === team.currentPuzzle));
    if (i < 0) {
      console.error(`Could not find original puzzle for team "${team.name}"` +
                    ` with currentPuzzle=${team.currentPuzzle}`);
      console.error(team.puzzles);
      return;
    }
    const puzzle = team.puzzles[i];
    const allowedTime = { minutes: puzzle.allowedTime };
    const timeOutScore = moment.duration({ minutes: puzzle.timeoutScore }).asSeconds();
    const maxTime = moment(puzzle.start).add(allowedTime);
    const answer = puzzles_cached[puzzle.puzzleId].answer;

    // Time out the given puzzle for this team.
    if (now.isAfter(maxTime)) {
      console.log(`Team "${team.name}" timed out on puzzle ${puzzle.name}`);
      try {
        await db.collection("teams").updateOne(
          {_id: team._id},
          {
            $set: {
              currentPuzzle: null,
              [`puzzles.${i}.end`]: maxTime.toDate(),
              [`puzzles.${i}.score`]: timeOutScore,
              [`puzzles.${i}.answer`]: answer,
              [`puzzles.${i}.timedOut`]: true,
            },
          }
        );
      } catch (error) {
        console.error(`Failed to time out team "${team.name}"!`);
        console.error(error);
      }
    }
  });
}

async function runLoop(db) {
  console.log("Puzzle Watcher gameplay loop beginning");
  const puzzles_cached = await getPuzzles(db);
  while (true) {
    const teams = await getActiveTeams(db);
    await timeOutTeams(puzzles_cached, db);
    await sleep(1000);
  }
}

// =============================================================================
// Runner
// =============================================================================

async function main() {
  console.log("Puzzle Watcher worker process starting");
  const client = establishClient();
  await client.connect();
  const db = await client.db();

  // Wait for the game to start. Poll every minute until it does. Once
  // it starts, begin the run loop. The run loop can fail up to
  // ERROR_MAX times before we give up and quit the runner entirely.
  let error_count = 0;
  while (error_count < ERROR_MAX) {
    // TODO: this loop still isn't right because it doesn't properly
    // exit the RunLoop once gameplay is turned off. This isn't super
    // important since we can just kill the worker at that point, but
    // it's annoying and relevant for local debugging.
    if (await gameIsInPlay(db)) {
      try {
        await runLoop(db);
        console.error("Run loop returned. This is unexpected!");
      } catch(error) {
        console.error(`Run loop threw an error! ${error}`);
        error_count++;
        await sleep(5 * 1000);
      }
    } else {
      await sleep(60 * 1000);
    }
  }

  // Close so the worker process can shut down cleanly
  await client.close();
}

main().then(() => {
  console.log("Puzzle Watcher completed - shutting down");
}).catch(error => {
  console.error("Puzzle Watcher encountered an error:", error);
});
