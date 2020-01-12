import { Meteor } from 'meteor/meteor';
import moment from 'moment';

import { sendReports } from '../../lib/imports/sendReports';

SyncedCron.add({
  name: 'Nightly gear reports',
  schedule: function(parser) {
    // We're using UTC, so 8:15 = 12:15am PT
    return parser.text('at 08:15am');
  },
  job: function() {
    const gameState = Gamestate.findOne();
    const sendTime = moment();
    if(!gameState.doSendNightlyReports){
      return;
    }

    Meteor.logger.info(`Sending auto reports at ${sendTime} to: ${gameState.sendReportsTo}`);
    sendReports(gameState.sendReportsTo);
    Gamestate.update({ _id: gameState._id}, { $set: { lastAutoReportSend: sendTime }});
  }
});

SyncedCron.config({
  utc: true,
});
SyncedCron.start();
