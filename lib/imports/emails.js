import { Meteor } from 'meteor/meteor';
import { Email } from 'meteor/email';

const { siteName, siteURL, accountsEmail, eventYear, eventDate, eventDay, registrationCloseDate } = Meteor.settings.public;

export const emailTeamInvite = (team, user, to) => {

  const subject = `${siteName} Team Invitation for ${team.name}`;
  const registerUrl = Meteor.absoluteUrl('register', { secure: Meteor.isProduction });
  const loginUrl = Meteor.absoluteUrl('profile', { secure: Meteor.isProduction });

  const html = `
<p>You have been invited by ${user.name} to join the team "${team.name}" in the ${eventYear} ${siteName}!</p>
<p>To accept your invitation follow these steps:</p>
<ol>
  <li><a href="${registerUrl}" target="_blank">Register for the ${eventYear} ${siteName}</a>. (If you already have an account skip to step 2.)</li>
  <li><a href="${loginUrl}" target="_blank">Log in</a> and accept your invitation!</li>
</ol>
<br>
${questions}
${signature}
`;

  return Email.send({
    from: accountsEmail,
    to,
    subject,
    html,
  });
};

export const questions = `<p>If you have any questions please email <a href="mailto:support@greatpuzzleHunt.com">support@greatpuzzlehunt.com</a></p>`;

export const signature = `
<p>
  Cheers,<br>
  The ${siteName} Team
</p>
`;
