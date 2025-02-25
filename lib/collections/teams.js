import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { 
  _,
  times,
  random,
  pick,
  find,
  findIndex,
  sample,
  cloneDeep,
  omit,
} from 'lodash';
import moment from 'moment';

import { requireUser, requireVolunteer, NonEmptyString, requirePattern,
	 ValidNameString, notAfterCheckIn, checkMsg, requireAdmin } from '../imports/method-helpers.js';
import { getPuzzleScore } from '../imports/puzzle-helpers';
import { getShortName } from '../imports/util';

import { Invites } from './invites.js';

export const Teams = new Mongo.Collection('teams');

// Ensure index
Meteor.startup(function () {
  if (Meteor.isServer) {
    Teams.createIndex({ "name": 1});
  }
});

const max_name_length = 50; 

function teamPuzzleCopy(puzzle) {
  const copy = cloneDeep(omit(puzzle, ['_id']));
  copy.answer = null;
  copy.downloadURL = "";
  copy.puzzleId = puzzle._id;
  copy.hints = copy.hints.map(() => {
    return { taken: false };
  })
  copy.triggerCodewords = '';
  copy.triggerHintImageURL = '';
  copy.start = null; // JS Date Object
  copy.end = null; // JS Date Object
  copy.score = null; // Score will be stored in seconds.
  return copy;
}

Meteor.methods({
  async 'team.owner'(userId) {
    check(userId, String);
    const user = await Meteor.userAsync();
    if (!user) {
      throw new Meteor.Error(400, 'You must be logged in!');
    }

    const owner = await Meteor.users.findOneAsync(userId);
    return owner ? {
      name: owner.name,
      email: owner.getEmail(),
      phone: owner.phone,
    } : null;
  },

  async 'teams.upsert'(team) {
    check(team, Object);

    const { name, password, division, inPerson, lookingForMembers } = team;

    requirePattern(name, NonEmptyString, "You must choose a team name!");
    requirePattern(name, ValidNameString, "You must use only letters, numbers, and limited punctuation in a team name!");
    requirePattern(password, NonEmptyString, "You must choose a team password!");
    requirePattern(division, NonEmptyString, "You must choose a division!");
    requirePattern(inPerson, Boolean, "You must specify in-person or virtual!");
    requirePattern(lookingForMembers, Boolean, "Looking for members must be true or false!");

    const isNewTeam = !team._id;
    const user = await Meteor.userAsync();
    if (!isNewTeam) {
      notAfterCheckIn();
    }

    if (!user) {
      throw new Meteor.Error(400, 'You must be logged in!');
    }

    // Only execute the rest of this function on the server.
    if (!Meteor.isServer) {
      return true;
    }

    const now = new Date();
    team.updatedAt = now;
    team.name = team.name.trim();

    // Add initial fields for new teams
    if (isNewTeam) {
      team = _.extend(team, {
        owner: user._id,
        createdAt: now,
        members: [user._id],
        destination: null,
	lcName: team.name.toLowerCase(),
      });
    }

    // Trim fields:
    team.name = team.name.trim();
    team.lcName = team.name.toLowerCase();
    team.password = team.password.trim();
    
    // Ensure team name is not too long
    if (team.name.length > max_name_length) {
      throw new Meteor.Error(400, 'Team name is too long! Maximum '+ max_name_length +' characters');
    }

    // Ensure team name contains at least 3 alphanumeric characters
    if (team.name.replace(/[^A-Z0-9]/gi, "").length < 3) {
      throw new Meteor.Error(400, 'Team name must contain at least 3 alphanumeric characters!');
    } 

    // Check for existing team name
    const opts = {
      lcName: team.lcName,
    };
    if (!isNewTeam) {
      opts._id = { $ne: team._id };
    };
    const duplicateNameTeam = await Teams.findOneAsync(opts);
    if (duplicateNameTeam) {
      throw new Meteor.Error(400, 'A team with that name already exists!');
    }

    // if team already exists check the update is comig from a current member:
    if (!isNewTeam) {
      const thisTeam = await Teams.findOneAsync({_id: team._id });
      if (_.indexOf(thisTeam.members, user._id) === -1) {
        throw new Meteor.Error(404, 'You are not on this team!');
      }
    }

    // Upsert the team
    const selector = isNewTeam ? { name: team.name } : { _id: team._id };
    const result = await Teams.upsertAsync(selector, { $set: team });

    Meteor.logger.info(`Team '${team.name}' ${isNewTeam ? "created" : "updated"}`);
    if (result.insertedId) {
      await Meteor.users.updateAsync(user._id, { $set: { teamId: result.insertedId } });
    }

    return result;
  },

  async 'teams.removeMember'(member) {
    check(member, Object);
    requireUser();

    // Everything else should only run on the server.
    if (!Meteor.isServer) return true;
    notAfterCheckIn();

    const user = await Meteor.users.findOneAsync({ _id: this.userId });
    const memberToDelete = await Meteor.users.findOneAsync({ _id: member._id });
    const team = await Teams.findOneAsync({ _id: user.teamId });

    if (memberToDelete._id === user._id) {
      throw new Meteor.Error(400, 'You cannot remove yourself! (To delete your team you must enter the Danger Zone and delete your team!)');
    }

    // Check this user has authority to delete other users.
    if (team.owner === user._id && memberToDelete.teamId === team._id) {
      await Meteor.users.updateAsync({ _id: memberToDelete._id }, { $set: { teamId: null }});
      await Teams.updateAsync({ _id: team._id }, { $pull: { members: memberToDelete._id }});
      return true;
    } else {
      throw new Meteor.Error(400, 'You must be the team owner to remove members!');
    }
  },

  async 'teams.join'(teamId, password) {
    check(teamId, String);
    check(password, String);

    const user = await Meteor.userAsync();
    if (!user) throw new Meteor.Error(400, 'You must be logged in!');
    else if (user.teamId) throw new Meteor.Error(400, 'You are already on a team!');

    // Everything else should only run on the server.
    if (!Meteor.isServer) return true;

    const team = await Teams.findOneAsync(teamId);
    if (!team) {
      throw new Meteor.Error(400, 'No Team with that Id!');
    }
    else if (team.members.length >= 6) {
      throw new Meteor.Error(400, 'Sorry this team is full!');
    }
    else if (team.checkinConfirmed) {
      throw new Meteor.Error(400, 'Sorry this team is already checked in and ready to play!');
    }
    else if (password.trim() !== team.password) {
      throw new Meteor.Error(400, 'Incorrect password!');
    }

    // Goo to add user to team.
    await Teams.updateAsync(teamId, { $push: { members: user._id }, $set: { updatedAt: new Date() } });
    await Meteor.users.updateAsync(user._id, { $set: { teamId: teamId } });
    // Also check if there were any invites for this user to this team.
    await Invites.updateAsync({
      teamId,
      email: user.getEmail(),
    }, {
      $set: { accepted: true },
    });
    return true;
  },

  async 'teams.leave'() {
    requireUser();

    const user = await Meteor.userAsync();
    if (!user.teamId) {
      throw new Meteor.Error(400, 'You must be on a team to leave your team!');
    }

    // Everything else should only run on the server.
    if (!Meteor.isServer) return true;
    notAfterCheckIn();

    const team = await Teams.findOneAsync({ _id: user.teamId });
    if (user._id === team.owner) {
      throw new Meteor.Error(400, 'You must delete your team if you are the owner and you want to leave your team!');
    }

    await Meteor.users.updateAsync({ _id: user._id }, { $set: { teamId: null }});
    await Teams.updateAsync({_id: team._id }, { $pull: { members: user._id }});
    return true;
  },

  async 'teams.delete'() {
    requireUser();

    const user = await Meteor.userAsync();
    if (!user.teamId) {
      throw new Meteor.Error(400, 'You must be on a team to leave your team!');
    }
    // Everything else should only run on the server.
    if (!Meteor.isServer) return true;
    notAfterCheckIn();

    const team = await Teams.findOneAsync(user.teamId);
    if (user._id !== team.owner) {
      throw new Meteor.Error(400, 'You must be the owner of your team to delete it!');
    }

    await Meteor.users.updateAsync({ teamId: user.teamId }, { $set: { teamId: null } }, { multi: true });
    await Invites.removeAsync({ teamId: user.teamId });
    await Teams.removeAsync({ _id: team._id });
    return true;
  },

  async 'team.checkin.start'() {
    requireUser();
    const user = await Meteor.userAsync();
    if (!user.teamId) {
      throw new Meteor.Error(400, 'You must be on a team to start team check in!');
    }
    // Everything else should only run on the server.
    if (!Meteor.isServer) return true;

    // Set user's team userCheckin to true:
    await Teams.updateAsync({ _id: user.teamId }, {
      $set: { userCheckin: true, checkedInBy: user._id },
    });
  },

  async 'team.checkin.user'(userId) {
    check(userId, String)
    requireUser();
    const currentUser = await Meteor.userAsync();
    const userToToggle = await Meteor.users.findOneAsync(userId);

    // Validate users
    if (!currentUser.teamId) { throw new Meteor.Error(400, "You must be on a team to check people in!"); }
    if (!userToToggle) { throw new Meteor.Error(400, `There is no user with id ${userId}!`); }
    if (currentUser.teamId !== userToToggle.teamId) { throw new Meteor.Error(400, `You and user "${userId}" must be on the same team!`); }
    if (!userToToggle.paid) { throw new Meteor.Error(400, `Oops, ${userToToggle.firstname} has not paid yet! Only Paid members can participate!`); }

    // Toggle user's checkIn status.
    return await Meteor.users.updateAsync({ _id: userId }, {
      $set: {
        checkedIn: !userToToggle.checkedIn,
      }
    });
  },

  async 'team.checkin.confirm'(teamId) {
    check(teamId, String);
    requireVolunteer();

    const team = await Teams.findOneAsync(teamId);
    if (!team) { throw new Meteor.Error(400, `Error! No team found for id ${teamId}`); }
    if (!team.userCheckin) { throw new Meteor.Error(400, `Error! ${team.name} hasn't checked in yet!`); }

    return await Teams.updateAsync({ _id: teamId }, { $set: { checkinConfirmed: true } });
  },

  async 'team.checkin.virtuallyByPlayer'(teamId) {
    checkMsg(teamId, String, "Invalid team ID");

    const team = await Teams.findOneAsync(teamId);
    if (!team) { throw new Meteor.Error(400, `Error! No team found`); }
    if (!team.userCheckin) { throw new Meteor.Error(400, `Error! Your team hasn't checked in yet!`); }

    return await Teams.updateAsync({ _id: teamId }, { $set: { checkinConfirmed: true } });
  },

  async 'team.checkin.toggle'(teamId) {
    check(teamId, String);
    requireVolunteer();

    const team = await Teams.findOneAsync(teamId);
    if (!team) { throw new Meteor.Error(400, `Error! No team found for id ${teamId}`); }
    if (!Meteor.isServer) return true;

    if (!team.userCheckin) {
      let msg = `Error! One or more members of ${team.name} haven't checked in yet!`;
      throw new Meteor.Error(400, msg);
    }

    return await Teams.updateAsync(
      {
        _id: teamId,
      },
      {
        $set: {
          checkinConfirmed: !team.checkinConfirmed
        },
      },
    );
  },

  async 'team.begin'() {
    requireUser();
    const user = await Meteor.userAsync();
    if (!user.teamId) {
      throw new Meteor.Error(400, 'You must be on a team to begin the Game!');
    }

    if (!Meteor.isServer) return true;

    const gamestate = await Gamestate.findOneAsync();
    if (!gamestate.gameplay) { throw new Meteor.Error(400, "You cannot start until Gameplay has begun!"); }

    const puzzles = await Puzzles.find().fetchAsync();
    if (puzzles.length === 0) throw new Meteor.Error(400, 'There are no Puzzles!');

    const team = await Teams.findOneAsync(user.teamId);
    if (team.hasBegun) { throw new Meteor.Error(400, "You're team has already begun the game!"); }

    const puzzleCopies = puzzles.map(teamPuzzleCopy);
    const startLocation = sample(puzzles.filter(p => p.stage === 0)).name;
    return await Teams.updateAsync(user.teamId, {
      $set: {
        hasBegun: true,
        beganAt: new Date(),
        startLocation: startLocation,
        puzzles: puzzleCopies,
        currentPuzzle: null,
      },
    });
  },

  async 'team.puzzle.giveUp'(puzzleId, teamId){
    check(puzzleId, String);
    check(teamId, String);
    requireUser();
    const user = await Meteor.userAsync();
    if (!user.teamId) throw new Meteor.Error(400, 'You must be on a team to give up!');

    const team = await Teams.findOneAsync(teamId);
    if(!team) throw new Meteor.Error(400, `No team found with id ${teamId}`);
    const teamNameShort = getShortName(team.name);
    if(!team.currentPuzzle) throw new Meteor.Error(400, "No active puzzle for this team");

    if (!Meteor.isServer) return true;

    const masterPuzzle = await Puzzles.findOneAsync(puzzleId);
    if (!masterPuzzle) throw new Meteor.Error(400, `Oops, no puzzle was found with id ${puzzleId}`);

    const i = findIndex(team.puzzles, (p) => p.puzzleId === puzzleId);
    const puzzle = team.puzzles[i] || {};
    if (!moment().isAfter(moment(puzzle.start) +
                          moment.duration({minutes: puzzle.allowedTime / 2}))) {
      throw new Meteor.Error(400, "You can't give up yet!");
    }

    const endTime = new Date();
    const score = moment.duration({minutes: masterPuzzle.timeoutScore}).asSeconds();
    const answer = masterPuzzle.answer.trim().toLowerCase();
    Meteor.logger.info(`Team "${teamNameShort}" is giving up on puzzle ${puzzle.name}`);

    await Teams.updateAsync(teamId, {
      $set: {
        currentPuzzle: null,
        [`puzzles.${i}.end`]: endTime,
        [`puzzles.${i}.score`]: score,
        [`puzzles.${i}.answer`]: answer,
        [`puzzles.${i}.timedOut`]: false,
        [`puzzles.${i}.gaveUp`]: true,
      },
    });
  },

  async 'team.puzzle.answer'(puzzleId, answer) {
    check(puzzleId, String);
    check(answer, String);
    requireUser();
    const user = await Meteor.userAsync();
    if (!user.teamId) throw new Meteor.Error(400, 'You must be on a team to answer a puzzle!');

    if (!Meteor.isServer) return true;

    const masterPuzzle = await Puzzles.findOneAsync(puzzleId);
    if (!masterPuzzle) throw new Meteor.Error(400, `Oops, no puzzle was found with id ${puzzleId}`);

    const team = await Teams.findOneAsync(user.teamId);
    if (!team) throw new Meteor.Error(400, `Oops, no team found with id ${user.teamId}`);

    let teamNameShort = getShortName(team.name);

    if (team.EMERGENCY_LOCK_OUT === true) {
      throw new Meteor.Error(400, `Uh oh!!! Your team is temporarily locked out. **Contact support for info**`);
    }

    const i = findIndex(team.puzzles, (p) => p.puzzleId === puzzleId);
    const nonCharacterDigit = /[^a-zA-Z0-9]/ug
    const cleanAnswer = answer.replace(nonCharacterDigit, '').toLowerCase();

    const isNonCompetitive = team.division === "noncompetitive";

    const tries = team.puzzles[i].tries;
    if (tries > 100 && tries % 50 === 0) {
      Meteor.logger.info(`HEY! Team "${teamNameShort}" has made ${tries} attempts at puzzle ${masterPuzzle.name}`);
    }

    // Special case if they guess a/the "trigger hint"
    const { triggerCodewords, triggerHintImageURL } = masterPuzzle;
    const triggers = triggerCodewords ? triggerCodewords.split(",") : [];
    if (triggers.length > 0) {
      if (cleanAnswer.length > 0 && triggers.indexOf(cleanAnswer) > -1) {
        Meteor.logger.info(`Team "${teamNameShort}" guessed the trigger codeword for "${masterPuzzle.name}"`);
        return {
          message: '',
          triggerHintImageURL: triggerHintImageURL
        }
      }
    }

    // Is this answer correct?
    if (cleanAnswer === masterPuzzle.answer.replace(/ /g, "").toLowerCase()) {
      // Yes - Score Puzzle.
      const endTime = new Date();
      const score = getPuzzleScore(team.puzzles[i], endTime, masterPuzzle, isNonCompetitive);

      Meteor.logger.info(`Team "${teamNameShort}" completed puzzle "${masterPuzzle.name}"`);

      await Teams.updateAsync(user.teamId, {
        $set: {
          currentPuzzle: null,
          [`puzzles.${i}.end`]: endTime,
          [`puzzles.${i}.score`]: score,
          [`puzzles.${i}.answer`]: cleanAnswer,
          [`puzzles.${i}.timedOut`]: false,
        },
      });
      return { message: 'Correct!' };
    } else {
      await Teams.updateAsync(user.teamId, {
        $inc: {
          [`puzzles.${i}.tries`]: 1,
        },
      });
      return { message: 'Nope, keep trying!' };
    }
  },

  async 'team.puzzle.takeHint'(puzzleId, hintIndex) {
    check(puzzleId, String);
    check(hintIndex, Number);
    requireUser();
    const user = await Meteor.userAsync();
    if (!user.teamId) throw new Meteor.Error(400, 'You must be on a team to leave your team!');

    if (!Meteor.isServer) return true;

    const team = await Teams.findOneAsync(user.teamId);
    if (!team) throw new Meteor.Error(400, `Oops, no team found with id ${user.teamId}`);

    const teamNameShort = getShortName(team.name);

    const masterPuzzle = await Puzzles.findOneAsync(puzzleId);
    if (!masterPuzzle) throw new Meteor.Error("400, Unable to find master puzzle");
    const masterHint = masterPuzzle.hints[hintIndex];
    if (!masterHint) throw new Meteor.Error("400, Unable to find master hint");

    const puzzleIndex = findIndex(team.puzzles, (p) => p.puzzleId === puzzleId);

    Meteor.logger.info(
      `Team "${teamNameShort}" is taking hint ${hintIndex} (puzzle ${puzzleIndex})`);

    return await Teams.updateAsync(user.teamId, {
      $set: {
        [`puzzles.${puzzleIndex}.hints.${hintIndex}.taken`]: true,
        [`puzzles.${puzzleIndex}.hints.${hintIndex}.text`]: masterHint.text,
        [`puzzles.${puzzleIndex}.hints.${hintIndex}.imageUrl`]: masterHint.imageUrl,
      },
    });
  },

  async 'team.startPuzzleVirtuallyByPlayer'(teamId, puzzleId) {
    check(teamId, String);
    check(puzzleId, String);
    if (!Meteor.isServer) return true;

    const team = await Teams.findOneAsync(teamId);
    if (!team) throw new Meteor.Error(400, `Oops, no team found with id ${teamId}`);
    const user = await Meteor.userAsync();
    if (team._id != user.teamId) throw new Meteor.Error(400, "User is not on this team!");
    const i = findIndex(team.puzzles, (p) => p.puzzleId === puzzleId);
    const puzzle = team.puzzles[i];
    const masterPuzzle = await Puzzles.findOneAsync(puzzle.puzzleId);
    if (!masterPuzzle) throw new Meteor.Error("500, Unable to find master puzzle");

    // Make sure there are no puzzles to solve with stage lower than this one still.
    const preReqPuzzles = team.puzzles.some((p, ix) => {
      if (ix === i) return false;
      return (!p.score && p.stage < puzzle.stage);
    });
    if (preReqPuzzles) throw new Meteor.Error(400, "Your team isn't ready for this puzzle yet!");

    const teamNameShort = getShortName(team.name);
    Meteor.logger.info(`Team "${teamNameShort}" is starting puzzle "${puzzle.name}" [virtually]`);

    return await Teams.updateAsync(teamId, {
      $set: {
        [`puzzles.${i}.start`]: new Date(),
        [`puzzles.${i}.downloadURL`]: masterPuzzle.downloadURL,
        currentPuzzle: puzzleId,
      },
    });

  },

  async 'volunteer.team.startPuzzle'(teamId, puzzleId) {
    check(teamId, String);
    check(puzzleId, String);
    requireVolunteer();
    if (!Meteor.isServer) return true;

    const team = await Teams.findOneAsync(teamId);
    if (!team) throw new Meteor.Error(400, `Oops, no team found with id ${teamId}`);
    const teamNameShort = getShortName(team.name);
    const i = findIndex(team.puzzles, (p) => p.puzzleId === puzzleId);
    const puzzle = team.puzzles[i];

    // Make sure there are no puzzles to solve with stage lower than this one still.
    const preReqPuzzles = team.puzzles.some((p, ix) => {
      if (ix === i) return false;
      return (!p.score && p.stage < puzzle.stage);
    });
    if (preReqPuzzles) throw new Meteor.Error(400, 'This team isn\'t ready for this puzzle yet!');

    Meteor.logger.info(`Team "${teamNameShort}" is starting puzzle "${puzzle.name}" [via qr code]`);

    return await Teams.updateAsync(teamId, {
      $set: {
        [`puzzles.${i}.start`]: new Date(),
        currentPuzzle: puzzleId,
      },
    });
  },

  async 'volunteer.team.resetPuzzle'(teamId, puzzleId) {
    check(teamId, String);
    check(puzzleId, String);
    requireVolunteer();
    if (!Meteor.isServer) return true;

    const user = await Meteor.userAsync();
    const team = await Teams.findOneAsync(teamId);
    if (!team) throw new Meteor.Error(400, `Oops, no team found with id ${teamId}`);
    const teamNameShort = getShortName(team.name);
    const volunteerName = `${user.firstname} ${user.lastname}`;
    const i = findIndex(team.puzzles, (p) => p.puzzleId === puzzleId);

    Meteor.logger.info(
      `Volunteer ${volunteerName} is resetting puzzle ${i} for team "${teamNameShort}"`);

    return await Teams.updateAsync(teamId, {
      $set: {
        [`puzzles.${i}.start`]: null,
        currentPuzzle: null,
      }
    });
  },

  async 'admin.team.toggleInPerson'(teamId) {
    check(teamId, String);
    requireAdmin();
    if (!Meteor.isServer) return true;

    const team = await Teams.findOneAsync(teamId);
    if (!team) throw new Meteor.Error(400, `Oops, no team found with id ${teamId}`);
    const currVal = team.inPerson || false;
    Meteor.logger.info(`Admin toggling inPerson value for team ${teamId}`);

    return await Teams.updateAsync(teamId, {
      $set: {
        inPerson: !currVal,
      }
    });
  },

  async 'admin.team.toggleLockout'(teamId) {
    check(teamId, String);
    requireAdmin();
    if (!Meteor.isServer) return true;

    const team = await Teams.findOneAsync(teamId);
    if (!team) throw new Meteor.Error(400, `Oops, no team found with id ${teamId}`);
    const currVal = team.EMERGENCY_LOCK_OUT || false;
    Meteor.logger.info(`${currVal ? "UN" : ""}LOCKING team ${teamId}`);

    return await Teams.updateAsync(teamId, {
      $set: {
        EMERGENCY_LOCK_OUT: !currVal,
      }
    });
  },

  // compute the score for a hypothetical puzzle response from a
  // team. Returns the computed score. This Method does not update any
  // database state
  async 'admin.team.computeScore'(puzzle) {
    check(puzzle, Object);
    requireAdmin()
    if (!Meteor.isServer) {
      return true;
    }
    
    const { puzzleId } = puzzle;
    const masterPuzzle = await Puzzles.findOneAsync(puzzleId);
    const endTime = puzzle.end;
    const [tempTimeout, tempScore] = getPuzzleScoreAndTimeout(puzzle, endTime, masterPuzzle, false);
    return [tempTimeout, tempScore];
  },

  // update the start time, end time, and hints taken information for
  // one team and puzzle.
  async 'admin.team.updatePuzzlePlay'(teamId, puzzle) {
    check(teamId, String);
    check(puzzle, Object);
    requireAdmin();
    if (!Meteor.isServer) {
      return true;
    }

    const team = await Teams.findOneAsync(teamId);
    if (!team) {
      throw new Meteor.Error(400, `Oops, no team found with id ${teamId}`);
    }
    const { puzzleId } = puzzle;
    const i = findIndex(team.puzzles, (p) => p.puzzleId === puzzleId);
    if (!i) {
      throw new Meteor.Error(400, `Oops, no puzzle found with id ${puzzleId}`);
    }

    const puzzleName = puzzle.name;
    const newStart = puzzle.start;
    const newEnd = puzzle.end;
    const newHints = puzzle.hints;
    const masterPuzzle = await Puzzles.findOneAsync(puzzleId);
    const [newTimeout, newScore] = getPuzzleScoreAndTimeout(puzzle, newEnd, masterPuzzle, false);

    let s='';
    newHints.forEach((hint, index) => {
      s += (hint.taken ? '1' : '0');
    });
    Meteor.logger.info(`updating puzzle play info for team ${teamId} puzzle ${puzzleName}, start ${newStart}, end ${newEnd}, hints ${s}`);

    return await Teams.updateAsync(teamId, {
      $set: {
	[`puzzles.${i}.start`]: newStart,
	[`puzzles.${i}.end`]: newEnd,
	[`puzzles.${i}.hints`]: newHints,
	[`puzzles.${i}.timedOut`]: newTimeout,
	[`puzzles.${i}.score`]: newScore
      }
    });
  },

  async 'admin.team.toggleIneligible'(teamId) {
    check(teamId, String);
    requireAdmin();
    if (!Meteor.isServer) return true;

    const team = await Teams.findOneAsync(teamId);
    if (!team) throw new Meteor.Error(400, `Oops, no team found with id ${teamId}`);
    const currVal = team.prize_ineligible || false;
    Meteor.logger.info(`marking team ${teamId} ${currVal ? "eligible" : "ineligible"} for prizes`);

    return await Teams.updateAsync(teamId, {
      $set: {
        prize_ineligible: !currVal,
      }
    });
  },

});
