import { withTracker } from 'meteor/react-meteor-data';

import { THCheckpoints } from '../../../../../lib/collections/thcheckpoints.js'

export default (Comp) => withTracker(() => {
  const handle = Meteor.subscribe('admin.thcheckpoints');
  const ready = handle.ready();
  const checkpoints = THCheckpoints.find({}).fetch();

  return {
    ready,
    checkpoints,
  };
})(Comp);
