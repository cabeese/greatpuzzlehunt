import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Mongo } from 'meteor/mongo';
import { check, Match } from 'meteor/check';
import { requireAdmin, isAdmin, ValidEmail,
	 checkMinLength, NonEmptyString, StringPhoneNumber, BooleanTrue,
	 nonDigits, PositiveNumber,
	 requireUser, makeName
       } from '../imports/method-helpers.js';
import { emailUserMessage } from '../imports/emails';
import _ from 'lodash';

const PASSWORD_MIN_LENGTH = 6;

import { Gamestate } from './gamestate-collection.js'

// Ensure index
Meteor.startup(function () {
  if (Meteor.isServer) {
    Meteor.users.createIndex({ "firstname": 1, "lastname": 1, "email": 1 });
  }
});

// Add Transform to user's Collection
Meteor.users._transform = function(user) {
  user.hasRole = function(role) {
    // TODO: this sometimes gets called on a 'user' object whose
    // `.roles` property is undefined. We can make sure it's present,
    // but it would be good to understand what code (likely in
    // Authed.jsx) is able to get a partially-undefined User object.
    if (!this.roles) {
      console.error(`called user.hasRole(${role}) but 'roles' is not set`);
      return false;
    }
    return this.roles.indexOf(role) >= 0;
  };

  user.getEmail = function(index = 0) {
    if (this.emails && this.emails.length > 0 && index < this.emails.length && index >= 0) {
      return this.emails[index].address;
    }
    return null;
  }

  user.email = user.getEmail();

  user.name = makeName(user.firstname, user.lastname);

  user.isVerified = function() {
    return this.emails && this.emails.length > 0 && this.emails[0].verified;
  }

  return user;
};


export const errorMap = {
  firstname: 'Please enter your First Name.',
  lastname: 'Please enter your Last Name.',
  email: 'Please enter your email.',
  accountType: 'Please select an Account Type.',
  password: 'Please enter a Password.',
  confirmPassword: 'Please confirm your Password.',
  gameMode: 'Please select either in-person or virtual gameplay',
  phone: 'Please enter your 10 digit phone number.',
  age: ' Please enter your age.',
  address: 'Please enter your address.',
  city: 'Please enter your city.',
  zip:'Please enter your zip code.',
  state:'Please select your state or province.',
  country: 'Please enter your country.',
  ecName:"Please enter your emergency contact's name.",
  ecRelationship:"Please enter your relationship to your emergency contact.",
  ecPhone:"Please enter your emergency contact's phone number.",
  ecEmail:"Please enter your emergency contact's email address.",
  parentGuardian: "A legal parent/guardian name is required for players under age 14.",
  photoPermission: 'Photo permission is a Boolean option (true/false).',
  holdHarmless: 'You must accept the Acknowledgement of Risk & Hold Harmless Agreement found above.',
  bio: 'Your bio must be a string of text.',
  lookingForTeam: '"Looking for team" is a Boolean option (true/false).',
};

function checkUserData(data) {
  try {
    check(data, {
      firstname: NonEmptyString,
      lastname: NonEmptyString,
      email: ValidEmail,
      accountType: Match.OneOf('STUDENT', 'NONSTUDENT', 'VOLUNTEER'),
      password: NonEmptyString,
      confirmPassword: NonEmptyString,
      gameMode: Match.OneOf('INPERSON', 'VIRTUAL'),
      coords: Match.Any,
      phone: Match.Any,
      age: PositiveNumber,
      address: NonEmptyString,
      city: NonEmptyString,
      state: Match.Any,
      zip: Match.Any,
      country: NonEmptyString,
      ecName: NonEmptyString,
      ecRelationship: NonEmptyString,
      ecPhone: Match.Any,
      ecEmail: ValidEmail,
      parentGuardian: String,
      photoPermission: Boolean,
      holdHarmless: BooleanTrue,
    });
  } catch(ex) {
    throw getFormError(ex);
  }
};

function checkUserProfileData(data) {
  try {
    check(data, {
      firstname: NonEmptyString,
      lastname: NonEmptyString,
      gameMode: NonEmptyString,
      bio: Match.Optional(String),
      lookingForTeam: Boolean,
    });
  } catch(ex) {
    throw getFormError(ex);
  }
};

export function getFormError(ex) {
  Meteor.logger.info(`Getting exception error for: ${ex}`);
  Meteor.logger.info(ex);
  let reason = errorMap[ex.path] || "An unknown error has occured. Please let the web team know about this!";
  return new Meteor.Error(400, reason);
};

function checkPassword(password1, password2, minLength = PASSWORD_MIN_LENGTH) {
  if (password1.length < minLength) {
    throw new Meteor.Error(400, `Password must be at least ${minLength} characters long!`);
  }
  else if (password1 !== password2) {
    throw new Meteor.Error(400, 'Passwords do not match!');
  }
}

function checkParentGuardian(age, parentGuardian) {
  if (age < 14) {
    checkSomeTextData('parentGuardian', parentGuardian, 3);
  }
}

// Check if the country entered is for the United States.
function isUnitedStates(country) {
  let c = country.toUpperCase();
  return ((c == 'UNITED STATES') ||
	  (c == 'USA') ||
	  (c == 'U.S.') ||
	  (c == 'U.S.A.') ||
	  (c == 'US'));
}

// Check if the country entered is for Canada
function isCanada(country) {
  let c = country.toUpperCase();
  return ((c == 'CANADA') || (c == 'CA') || (c == 'CAN'));
}

// State values are required for the US and Canada; not checked
// for other countries
function checkCountryState(data) {
  let country = data.country;
  if (isUnitedStates(country) || isCanada(country)) {
    if ((data.state == '') || (data.state == 'OTHER')) {
      throw new Meteor.Error(400, 'State/province required for US and Canadian addresses');
    }
  }
}

// If this is a US or Canadian address, phone number is required; if
// not, phone number is optional
function checkPhoneNumbers(country, playerPhone, ecPhone) {
  if (!isUnitedStates(country) && !isCanada(country)) {
    return
  }

  if (!playerPhone || (playerPhone.length == 0)) {
    throw new Meteor.Error(400, 'Phone number required for US and Canadian addresses');
  }
  if (!ecPhone || (ecPhone.length == 0)) {
    throw new Meteor.Error(400, 'Emergency contact phone number required for US and Canadian addresses');
  }
  let x = playerPhone.replace(/\D/g, '');
  if (x.length != 10) {
    throw new Meteor.Error(400, 'Valid phone number required for US and Canadian addresses');
  }
  x = ecPhone.replace(/\D/g, '');
  if (x.length != 10) {
    throw new Meteor.Error(400, 'Valid emergency contact phone number required for US and Canadian addresses');
  }
}


// check a value to make sure it has some meaningful content -- not
// blank, a dash, and so on. Assumes that the field has already been
// checked to be a non-empty string
function checkSomeTextData(fieldName, value, minLength) {
  const invalidTextData = ['-', '--', '*'];

  if ((value.trim().length < minLength) ||  invalidTextData.includes(value.trim())) {
    throw new Meteor.Error(400, errorMap[fieldName]);
  }
  const count = (value.match(/[A-Za-z]/g) || []).length;
  if (count < minLength) {
    throw new Meteor.Error(400, errorMap[fieldName]);
  }
}

// If this is a US address, check that the zip code conforms to a zip
// or zip+4 pattern. If this is a Canadian address, check that the
// postcode conforms to the Canadian code pattern. Do not check other
// countries.
function checkPostalCode(country, postcode) {
  let okay = true;
  if (isUnitedStates(country)) {
    if (!postcode) {
      throw new Meteor.Error(400, 'Zip code required for US addresses');
    }
    const zip5 = /^\d{5}$/;
    const zipplus4 = /^\d{5}\-\d{4}/;
    if (!(postcode.match(zip5) || postcode.match(zipplus4))) {
      throw new Meteor.Error(400, 'Invalid Zip code format for a US address'); 
    }
  } else if (isCanada(country)) {
    if (postcode.length == 0) {
      throw new Meteor.Error(400, 'Postal code required for Canadian addresses');
    }
    let pc = postcode.toUpperCase();
    const pcspace = /^[A-Z]\d[A-Z]\s\d[A-Z]\d$/;
    const pcnospace = /^[A-Z]\d[A-Z]\d[A-Z]\d$/;
    if (!(pc.match(pcspace) || pc.match(pcnospace))) {
      throw new Meteor.Error(400, 'Invalid postal code format for a Canadian address'); 
    }
  }
}

// Ensure that a user has their bio filled out if they wish to be
// listed on the "Looking for a Team" page.
function checkLFTAndBio(lookingForTeam, bio) {
  if (!lookingForTeam) return;
  if (!bio || bio.length < 7) {
    throw new Meteor.Error(400,
                           "You must enter a bio to list yourself as 'Looking for a Team'");
  }
}

// User collections methods:
Meteor.methods({
  async 'user.register'(data) {
    checkUserData(data);

    data.age = parseInt(data.age);

    if (!Meteor.isServer) return true;
    // 1. Check Extra reqs:
    // Password meets requirements
    checkPassword(data.password, data.confirmPassword);
    // If under 14 has parentGuardian
    checkParentGuardian(data.age, data.parentGuardian);
    // check that country, state, and zip/postal code make sense
    checkCountryState(data);
    checkPostalCode(data.country, data.zip);
    checkPhoneNumbers(data.country, data.phone, data.ecPhone);

    // 2. Configure role
    const roles = ['user'];
    const isVolunteer = data.accountType === 'VOLUNTEER';
    roles.push(isVolunteer ? 'volunteer' : 'player');

    // 3. Check in-person registration limit
    if (!isVolunteer && data.gameMode === "INPERSON") {
      if (await Gamestate.findOneAsync({}).registrationInPersonOpen === false) {
        throw new Meteor.Error(400,
          "Sorry, We can no longer accept in-person players at this time");
      }
    }

    // 4. Check that several fields have useful information in them
    checkSomeTextData('firstname', data.firstname, 1); 
    checkSomeTextData('lastname', data.lastname, 2);
    checkSomeTextData('address', data.address, 2);
    checkSomeTextData('city', data.city, 2);
    checkSomeTextData('country', data.country, 2);
    checkSomeTextData('ecName', data.ecName, 3);
    checkSomeTextData('ecRelationship', data.ecRelationship, 3);
    

    // Starting in 2023, registration is free, so user accounts will
    // automatically be marked as "paid." If we ever go back to paid
    // registration, change this to `data.paid = isVolunteer`.
    data.paid = true;
    data.roles = roles;

    const userId = await Accounts.createUser(data);
    Accounts.sendVerificationEmail(userId);
    Meteor.logger.info(`User registered with email ${data.email}`);
  },

  async 'user.update.account'(fields) {
    checkUserProfileData(fields);

    if (!Meteor.isServer) { return true; }

    requireUser();
    const currentUser = Meteor.userId();
    const { firstname, lastname, gameMode, lookingForTeam, bio } = fields;
    checkLFTAndBio(lookingForTeam, bio);

    return await Meteor.users.updateAsync(currentUser, {
      $set: {
        firstname,
        lastname,
        gameMode,
        lookingForTeam,
        bio,
        updatedAt: new Date(),
      },
    });
  },

  'user.update.password': async function(fields) {
    check(fields, {
      newPassword: String,
      confirmPassword: String,
    });

    if (!Meteor.isServer) {
      return true;
    }

    requireUser();
    const currentUser = Meteor.userId();

    const { newPassword, confirmPassword } = fields;

    if (newPassword.length < PASSWORD_MIN_LENGTH) {
      throw new Meteor.Error(400, `Password must be at least ${PASSWORD_MIN_LENGTH} characters long!`);
    }
    else if (newPassword !== confirmPassword) {
      throw new Meteor.Error(400, 'Passwords do not match!');
    }

    await Accounts.setPasswordAsync(currentUser, newPassword, {
      logout: false,
    });
    await Meteor.users.updateAsync(currentUser, {
      $set: { updatedAt: new Date() },
    });

    return true;
  },

  async 'user.passwordReset'(email) {
    check(email, String);

    if (!Meteor.isServer) { return true; }

    if (email.length < 1) {
      throw new Meteor.Error(400, 'You must enter an email!');
    }

    const user = await Accounts.findUserByEmail(email);
    if (user) {
      Accounts.sendResetPasswordEmail(user._id);
      return { email: user.getEmail() };
    }
    else {
      throw new Meteor.Error(400, 'No account found with that email!');
    }
  },

  async 'user.matchmaking-message'(email, message) {
    check(email, ValidEmail);
    check(message, String);
    requireUser();

    if (!Meteor.isServer) {
      return true;
    }

    const currentUser = Meteor.userId();
    const user = await Meteor.users.findOneAsync(currentUser);
    await emailUserMessage(user, email, message);
  },

  async 'user.redeem'(ticketCode) {
    check(ticketCode, String);
    requireUser();
    if (!Meteor.isServer) { return true; }

    const currentUserId = Meteor.userId();
    const user = await Meteor.users.findOneAsync(currentUserId);
    // validate user needs to redeem
    if (user.paid) { throw new Meteor.Error(400, 'Your account is already active!'); }

    const ticket = await Tickets.findOneAsync({ code: ticketCode });
    // Validate ticket
    if (!ticket) { throw new Meteor.Error(400, 'That ticket code does not exist!'); }
    if (ticket.redeemed) { throw new Meteor.Error(400, 'That ticket has already been redeemed!'); }
    if (ticket.type !== user.accountType) { throw new Meteor.Error(400, `That ticket is only redeemable by ${ticket.type} accounts. You must redeem a ${user.accountType} ticket code!`); }
    if (ticket.inPerson && !user.email.match(/@wwu.edu$/)) {
      Meteor.logger.info(`User ${user.email} attempted to use in-person ticket code ${ticketCode} without a WWU email address`);
      throw new Meteor.Error(400, "In-person ticket codes are only redeemable by WWU community for 2022. You must register with an @wwu.edu email address to redeem this ticket code.");
    }

    const now = new Date();
    // User gets to redeem this ticket.
    await Tickets.updateAsync(ticket._id, { $set: {
      redeemed: true,
      redeemedBy: user.getEmail(),
      updatedAt: now,
    }});
    return await Meteor.users.updateAsync(user._id, { $set: {
      paid: true,
      ticketUsed: ticketCode,
      updatedAt: now,
    }});
  },

});
