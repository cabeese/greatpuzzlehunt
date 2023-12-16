import { Meteor } from 'meteor/meteor';

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
