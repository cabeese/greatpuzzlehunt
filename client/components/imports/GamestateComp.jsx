import React from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';

import { Gamestate } from '../../../lib/collections/gamestate-collection.js';

export default (Comp) => withTracker(() => {
  const handle = Meteor.subscribe('gamestate');
  const ready = handle.ready();
  const gamestate = Gamestate.findOne({});

  return {
    ready,
    gamestate,
  };
})(Comp);
