// NOTE! Migrations are no longer run in sequence!
// This is due to the Meteor 3 transition to async/await.
// See https://github.com/percolatestudio/meteor-migrations/issues/89
Meteor.startup(() => {
  Migrations.migrateTo('latest');
});
