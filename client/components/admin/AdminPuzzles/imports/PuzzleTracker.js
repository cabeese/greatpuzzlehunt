import { withTracker } from 'meteor/react-meteor-data';

import { Puzzles } from '../../../../../lib/collections/puzzles.js'

export default (Comp) => withTracker(() => {
  const handle = Meteor.subscribe('admin.puzzles');
  const ready = handle.ready();
  const puzzles = Puzzles.find({}).fetch();

  return {
    ready,
    puzzles,
  };
})(Comp);
