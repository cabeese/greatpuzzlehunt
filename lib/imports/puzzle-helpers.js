import { Meteor } from 'meteor/meteor';
import moment from 'moment';

const HINT_PENALTY = {
  0: 0,
  1: 5,
  2: 15,
  3: 30
};

export function getHintsTaken(puzzleOrHints){
  let hints = puzzleOrHints;
  if (hints.hints) {
    hints = hints.hints;
  }
  return hints.reduce((accum, currVal) => accum + (currVal.taken ? 1 : 0), 0);
}

export function getPuzzleScore(puzzle, endTime, masterPuzzle, teamIsNC) {
  let {start, hints} = puzzle;
  let {bonusTime, allowedTime, timeoutScore} = masterPuzzle;
  const [timedOut, score] =  __scorePuzzle(start, endTime, getHintsTaken(hints), bonusTime, allowedTime, timeoutScore, teamIsNC);
  return score;
}

export function getPuzzleScoreAndTimeout(puzzle, endTime, masterPuzzle, teamIsNC) {
  let {start, hints} = puzzle;
  let {bonusTime, allowedTime, timeoutScore} = masterPuzzle;
  const [timedOut, score] =  __scorePuzzle(start, endTime, getHintsTaken(hints), bonusTime, allowedTime, timeoutScore, teamIsNC);
  return [timedOut, score];
}

export function __scorePuzzle(startTime, endTime, hintsTaken, puzzleBonusTime, puzzleAllowedTime, puzzleTimeoutTime, teamIsNC) {
  const s = moment(startTime);
  const e = moment(endTime);
  const solveTime = moment.duration(e - s);

  // Did they time out?
  if (!teamIsNC && (solveTime.asSeconds() >= moment.duration({ minutes: puzzleAllowedTime }).asSeconds())) {
    return [true, moment.duration({ minutes: puzzleTimeoutTime }).asSeconds()];
  }

  // Hint Penalty
  solveTime.add({ minutes: HINT_PENALTY[hintsTaken] });

  // bonus time ONLY IF no hints taken
  if (hintsTaken === 0) {
    solveTime.subtract({ minutes: puzzleBonusTime });
  }

  return [false, solveTime.asSeconds()];
}

export function getFinalScore(team){
  let { puzzles } = team;
  return puzzles.reduce((accum, puzzle) => accum + (puzzle.score ? puzzle.score : 0), 0);
}

export function getFinalScoreIfFinished(team){
  let { puzzles } = team;
  if (!puzzles) return Infinity;
  return puzzles.reduce((accum, puzzle) => accum + (puzzle.score ? puzzle.score : Infinity), 0);
}
