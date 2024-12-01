import { Meteor } from 'meteor/meteor';
import { Migrations } from "meteor/percolate:migrations";

// NOTE! Migrations are no longer run in sequence!
// This is due to the Meteor 3 transition to async/await.
// See https://github.com/percolatestudio/meteor-migrations/issues/89
Migrations.add({
  version: 3,
  up: function () {
    Gamestate.update({}, { $set: {
      sendReportsTo: ['greatpuzzlehunt@gmail.com', 'milliejohnson3.14@gmail.com'],
    }});
  },
  down: function () {
    // let's keep those.
  },
});
