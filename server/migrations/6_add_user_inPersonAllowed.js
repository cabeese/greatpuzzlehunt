import { Meteor } from 'meteor/meteor';

Migrations.add({
	version: 6,
	name: "Set inPersonAllowed flag to FALSE for existing users",
	up: function () {
		// We'll need to manually clean this up, which is doable for
		// the small number of affected users we have at this state in
		// registration for 2022.
		Meteor.users.update(
			{ inPersonAllowed: null },
			{ $set: { inPersonAllowed: false } },
			{ multi: true }
		);
	},
	down: function () {
		// let's keep it this way.
	},
});
