import { Meteor } from 'meteor/meteor';
import { isAdmin } from '../../lib/imports/method-helpers';

/* The image handling in mongo changed and is no longer supported with
 * the version we use with Meteor 2.5. For the time being, we'll disable
 * anything related to mongo image handling. */

// const store = new FS.Store.GridFS('images');

// Images = new FS.Collection("images", {
//   stores: [store],
// });

// function onImageUploaded(storeName, fileObj) {
//   // Check for referenced Sponsors.
//   const url = fileObj.url();
//   Sponsors.update({ imageId: fileObj._id }, { $set: {
//     logoUrl: url,
//   }});

//   // Other Updates.
// }

// // When store has uploaded something check for references that need updating.
// store.on('stored', Meteor.bindEnvironment(onImageUploaded, function(error) {
//   if (error) {
//     Meteor.logger.error("Error in bindEnvironment", error.reason);
//     Meteor.logger.logobj(error);
//   }
// }));

// Images.allow({
//   insert(userId, fileObj) {
//     return isAdmin(userId);
//   },
//   update(userId, fileObj) {
//     return isAdmin(userId);
//   },
//   download(userId, obj) {
//     return true;
//   },
//   remove(userId, fileObj) {
//     return isAdmin(userId);
//   }
// });


Meteor.methods({
});
