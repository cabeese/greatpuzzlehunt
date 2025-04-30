import { Meteor } from 'meteor/meteor';
import { Email } from 'meteor/email';
import { sortBy } from 'lodash';
import { getFinalScoreIfFinished } from './puzzle-helpers';

const { siteName, accountsEmail, eventYear, siteURL } = Meteor.settings.public;

import { Gamestate } from '../collections/gamestate-collection.js'
import { GearOrders } from '../collections/gear-orders.js'
import { Teams } from '../collections/teams.js'
import { Transactions } from '../collections/transactions.js'

function localizeCreatedAt(item){
    // Convert to local time so these times line up with CashNet report,
    // and remove the ',' so it takes only one cell in the spreadsheet.
    item.createdAt = new Date(item.createdAt).toLocaleString(
      'en-US',
      { timeZone: 'America/Vancouver' }
    ).replace(",", "");
}

function getShippingInfoArray(tx){
  tx = tx || {};
  const shipping = tx.shippingInfo || {};
  return [
    shipping.name,
    shipping.addr1,
    shipping.addr2,
    shipping.city,
    shipping.state,
    shipping.zip,
    shipping.country,
  ];
}

function cleanUpCellValues(row){
  return row.map(value => {
    if (typeof value === typeof "" && value.includes(",")){
      return value.replace(/,/g, " ");
    }
    if (value === false) return "FALSE";
    if (value === null) return "NULL";
    if (value === 0) return 0;
    return value || "";
  });
}

async function buildUserReport() {
  const USER_FIELDS = ["createdAt", "firstname", "lastname", "email", "gameMode",
    "accountType", "paid", "ticketUsed", "lookingForTeam", "teamName", "teamDivision",
    "age", "city", "state", "address", "zip", "country", "phone", "ecName",
    "ecRelationship", "ecPhone", "ecEmail", "photoPermission", "holdHarmless"];
  let csv = USER_FIELDS.join(",") + "\n";

  let teamsInPerson = 0;
  let teamsVirtual = 0;

  const all_teams = await Teams.find({}).fetchAsync();
  all_teams.forEach(item => {
    if (item.inPerson) {
      teamsInPerson += 1;
    } else {
      teamsVirtual += 1;
    }
  });

  const teams = all_teams.reduce((acc, team) => {
    acc[team._id] = team;
    return acc;
  }, {});

  let usersInPerson = 0;
  let usersVirtual = 0;
  let usersVolunteer = 0;
  let peopleInPerson = 0;

  const all_users = await Meteor.users.find({}, {sort: {"createdAt": 1}}).fetchAsync();
  all_users.forEach(item => {
    localizeCreatedAt(item);
    item.teamName = "";
    item.teamDivision = "";
    if (item.teamId) {
      const team = teams[item.teamId];
      item.teamName = team.name;
      item.teamDivision = team.division;
    }

    if (item.accountType == 'VOLUNTEER') {
      usersVolunteer += 1;
    } else {
      if (item.gameMode == 'INPERSON') {
        usersInPerson += 1;
      } else {
        usersVirtual += 1;
      }
    }

    if (item.gameMode == 'INPERSON') {
      peopleInPerson += 1;
    }

    csv += cleanUpCellValues(
      USER_FIELDS.map(field => item[field])
    ).join(",") + "\n";
  });

  csv += "Players in person," + usersInPerson.toString() + "\n";
  csv += "Players virtual," + usersVirtual.toString() + "\n";
  csv += "Players total," + (usersVirtual + usersInPerson).toString() + "\n";
  csv += "Users volunteer," + usersVolunteer.toString() + "\n";
  csv += "Users total," + (usersVirtual + usersInPerson + usersVolunteer).toString() + "\n";
  csv += "People in person," + peopleInPerson.toString() + "\n";
  csv += "Teams in person," + teamsInPerson.toString() + "\n";
  csv += "Teams virtual," + teamsVirtual.toString() + "\n";
  csv += "Teams total," + (teamsVirtual + teamsInPerson).toString() + "\n";

  return {
    filename: "users.csv",
    content: csv,
    encoding: "utf-8"
  };
}

async function buildTransactionReport() {
  const TX_FIELDS = ["createdAt", "tx", "name", "email",
                     "donations",
                     "countGearItems"];
  let csv = TX_FIELDS.join(",") + "\n";

  const transactions = await Transactions.find({}, {sort: { "createdAt": 1 }})
        .fetchAsync();
  transactions.forEach(item => {
    localizeCreatedAt(item);
    let gearOrders = item.gearOrders || [];
    item.countGearItems = gearOrders.length;

    csv += cleanUpCellValues(
      TX_FIELDS.map(field => item[field])
    ).join(",") + "\n";
  });

  return {
    filename: "transactions.csv",
    content: csv,
    encoding: "utf-8",
  };
}

async function buildGearOrders() {
  const GEAR_ORDER_FIELDS = ["createdAt", "tx", "email", "name", "itemcode",
                             "color", "logoColor", "size", "qty", "amount",
                             "shipping"];

  let csv = GEAR_ORDER_FIELDS.join(",") + ",";
  csv += [ "shipping name", "addr1", "addr2", "city", "state", "zip",
    "country", "numItems"].join(",") + "\n";

  const gear_orders = await GearOrders.find({}, {sort: {"createdAt": 1}}).fetchAsync();
  gear_orders.forEach(async (item) => {
    const tx = await Transactions.findOneAsync({tx: item.tx}) || {};
    localizeCreatedAt(item);
    item.name = tx.name;

    let row = GEAR_ORDER_FIELDS.map(field => item[field]).concat(
      getShippingInfoArray(tx),
      tx.gearOrders.length,
    );

    csv += cleanUpCellValues(row).join(",") + "\n";
  });

  return {
    filename: `gear_orders.csv`,
    content: csv,
    encoding: 'utf-8',
  };
}

async function buildUsersAndTeams() {
  const users = await Meteor.users.find({}).fetchAsync();
  const teams_raw = await Teams.find({}).fetchAsync();
  const teams = teams_raw.reduce((acc, team) => {
    acc[team._id] = team;
    return acc;
  }, {});

  const usersWithTeams = sortBy(users.map((user) => {
      if (user.teamId) {
        const team = teams[user.teamId];
        user.teamDivision = team.division;
        user.teamName = team.name;
        user.teamIsPlaying = team.hasBegun;
        user.teamSize = team.members.length

        user.checkedIn = Boolean(user.checkedIn);
      }
      return user;
    }), ['division', 'teamName', 'firstname', 'lastname']);

  const fields = [
    "teamDivision", "teamName", "teamIsPlaying",
    "checkedIn", "firstname", "lastname", "phone", "photoPermission",
    "ecName", "ecRelationship", "ecPhone", "ecEmail"
  ];
  let csv = fields.join(",") + "\n";
  usersWithTeams.forEach((user) => {
    csv += fields.map((field) => `"${user[field] || ''}"`).join(",") + "\n";
  });

  return {
    filename: `users_and_teams.csv`,
    content: csv,
    encoding: 'utf-8',
  };
}

async function buildLeaderboard() {
  const users = await Meteor.users.find({teamId: { $exists: true }}).fetchAsync();
  const all_teams = await Teams.find({}).fetchAsync();
  const teams = all_teams.reduce((acc, team) => {
    acc[team._id] = team;
    return acc;
  }, {});
  const fields = [
    "teamName", "eligible", "teamDivision", "score",
    "teamIsPlaying", "teamInPerson", "gameMode",
    "checkedIn", "firstname", "lastname", "phone", "photoPermission",
    "age", "city", "state", "address", "zip", "country",
  ];
  const usersWithTeams = sortBy(users.map((user) => {
    if (user.teamId) {
      const team = teams[user.teamId];
      user.eligible = team.prize_ineligible ? 'no' : '';
      user.teamDivision = team.division;
      user.teamName = team.name;
      user.teamIsPlaying = team.hasBegun;
      user.teamSize = team.members.length;
      user.teamInPerson = team.inPerson;
      user.score = getFinalScoreIfFinished(team);
      
      user.checkedIn = Boolean(user.checkedIn);
    }
    return user;
  }), ['division', 'eligible', 'teamName', 'firstname', 'lastname']);
  
  let csv = fields.join(",") + "\n";
  usersWithTeams.forEach((user) => {
    csv += fields.map((field) => `"${user[field] || ''}"`).join(",") + "\n";
  });
  
  return {
    filename: `leaderboard.csv`,
    content: csv,
    encoding: 'utf-8',
  };
}

export async function sendLeaderboard(to = null) {
		if (Meteor.isClient) return;
		const now = new Date();
		const sendTo = to || await Gamestate.findOneAsync().sendReportsTo;
		const subject = `GPH ${eventYear} Leaderboard`;
		const html = `<p>Here is the leaderboard as of ${now}</p>`;

		return await Email.sendAsync({
				from: accountsEmail,
				to: sendTo,
				subject,
				html,
				attachments: [
				  await buildLeaderboard(),
				],
		});
}

export async function sendReports(to = null) {
  if (Meteor.isClient) return;
  const now = new Date();
  const sendTo = to || await Gamestate.findOneAsync().sendReportsTo;
  const subject = `GPH ${eventYear} Admin Reports ${now}`;
  const html = `
<h3>Admin,</h3>
<p>
Attached are the admin reports for <a href="${siteURL}/admin/users">users</a>, transactions, and gear orders.
</p>

Cheers,
${siteName}
`;

  Meteor.logger.info(`Sending reports to: ${sendTo}`);

  return await Email.sendAsync({
    from: accountsEmail,
    to: sendTo,
    subject,
    html,
    attachments: [
      await buildUserReport(),
      await buildTransactionReport(),
      await buildGearOrders(),
    ]
  });
};

export async function sendUsersAndTeams(to = null) {
  if (Meteor.isClient) return;
  const now = new Date();
  const sendTo = to || await Gamestate.findOneAsync().sendReportsTo;
  const subject = `GPH ${eventYear} Admin Report: Users and Teams ${now}`;
  const html = `
<h3>Admin,</h3>
<p>
Attached are the users and teams!
</p>

Cheers,
${siteName}
`;

  Meteor.logger.info(`Sending reports to: ${sendTo}`);

  return await Email.sendAsync({
    from: accountsEmail,
    to: sendTo,
    subject,
    html,
    attachments: [
      await buildUsersAndTeams(),
    ]
  });
};

export async function downloadReport(index) {
  switch(index){
    case 0:
      return await buildUserReport();
    case 1:
      return await buildTransactionReport();
    case 2:
      return await buildGearOrders();
    case 3:
      return await buildLeaderboard();
    default:
      Meteor.logger.error(`downloadReport: Unknown report number ${index}`);
      return null;
  }
}
