import { Meteor } from 'meteor/meteor';
import moment from 'moment-timezone';

import { Gamestate } from '../../lib/collections/gamestate-collection.js'
import { sendReports } from '../../lib/imports/sendReports';

SyncedCron.add({
  name: 'Nightly gear reports',
  schedule: function(parser) {
    // We need to convert to UTC and account for Daylight Savings
    const time = moment().tz("America/Vancouver").isDST() ? "at 7:15am" : "at 8:15am";
    Meteor.logger.info(`Auto-reports scheduled for ${time}`);
    return parser.text(time);
  },
  job: async function() {
    const gameState = await Gamestate.findOneAsync();
    const sendTime = moment().toString();
    if(!gameState.doSendNightlyReports){
      return;
    }

    Meteor.logger.info(`Sending auto reports at ${sendTime} to: ${gameState.sendReportsTo}`);
    await sendReports(gameState.sendReportsTo);
    await Gamestate.updateAsync({ _id: gameState._id},
                                { $set: { lastAutoReportSend: sendTime }});
  }
});

SyncedCron.config({
  utc: true,
});
SyncedCron.start();
