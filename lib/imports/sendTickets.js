import { Meteor } from 'meteor/meteor';
import { Email } from 'meteor/email';

import { registrationInfoHTML, questions, signature } from './emails';

const { siteName, accountsEmail, eventYear, siteURL } = Meteor.settings.public;

export function sendTickets(tx, boughtBy) {
  Meteor.logger.info(`Sending tickets for tx: ${tx} to: ${boughtBy}`);

  const allTickets = Tickets.find({ tx: tx, boughtBy: boughtBy}).fetch();

  if (allTickets.length === 0) {
    Meteor.logger.info(`tx:${tx} boughtBy:${boughtBy} - Has no tickets!`);
    return;
  }

  const allTicketsHTML = ticketsHTML(allTickets);

  const subject = `${siteName} Ticket Codes`;
  const html = `
<p>Thank you for purchasing tickets for the ${eventYear} ${siteName}.</p>
<p><a target="_blank" href="${siteURL}/redeem">Redeem a ticket code</a> to finish registering your account.</p>
${questions}
${allTicketsHTML}
${registrationInfoHTML}
${signature}`;

  return Email.send({
    from: accountsEmail,
    to: boughtBy,
    subject,
    html,
  });
};

function ticketsHTML(tickets) {
  if (tickets.length === 0) return '';

  const ticketsList = tickets.map(ticketHTML).join('');
  return html = `
  <h4>Tickets:</h4>
  <table>
    <thead>
      <tr>
        <td>Ticket Code</td>
        <td>Account Type</td>
        <td>Play Type</td>
      </tr>
    </thead>
    <tbody>
      ${ticketsList}
    </tbody>
  </table>`;
};

function ticketHTML(ticket) {
  return `
  <tr>
    <td><code style="font-size:11pt;">${ticket.code}</code></td>
    <td>${ticket.isStudent ? "Student" : "Non-student"}</td>
    <td>${ticket.inPerson ? "In-person allowed" : "Virtual ONLY"}</td>
  </tr>`;
};
