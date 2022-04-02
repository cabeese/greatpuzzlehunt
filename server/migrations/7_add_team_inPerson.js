import { Meteor } from 'meteor/meteor';

Migrations.add({
	version: 7,
	name: "Set inPerson flag to FALSE for existing teams",
	up: function () {
		// We'll need to manually clean this up, which is doable for
		// the small number of affected teams we have at this state in
		// registration for 2022.
		Meteor.teams.update(
			{ inPerson: null },
			{ $set: { inPerson: false } },
			{ multi: true }
		);
	},
	down: function () {
		// let's keep it this way.
	},
});
