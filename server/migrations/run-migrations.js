Meteor.startup(() => {
  Migrations.migrateTo('6');
});
