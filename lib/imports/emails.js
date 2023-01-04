import { Meteor } from 'meteor/meteor';
import { Email } from 'meteor/email';

const { siteName, siteURL, accountsEmail, eventYear, eventDate, eventDay, registrationCloseDate } = Meteor.settings.public;
const { supportEmail } = Meteor.settings.public.contact;

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

export const emailUserMessage = (fromuser, toemail, message) => {
    const subject = `${siteName} player message`;
    let sanitized = message.replace(/&/g, '&amp;')
	.replace(/</g, '&lt;')
	.replace(/>/g, '&gt;')
	.replace(/"/g, '&quot;')
	.replace(/'/g, '&#039;');
    const html = `<p>You have been sent a message from player ${fromuser.name}:</p>
<p><pre>${sanitized}</pre></p>
<p>You can reply to them directly at <a href="mailto:${fromuser.email}">${fromuser.email}</a>.</p>
<div style="font-size: small">${questions}</div>
${signature}
`;

    const text = `You have been sent a message from player ${fromuser.name}:\n\n\
${message} \n\n\
You can reply to them directly at ${fromuser.email}.\n\n\
${questions_text} \n\n\
${signature_text}`
    
    return Email.send({
	from: accountsEmail,
	to: toemail,
	subject,
	html,
	text});
};

export const questions = `<p>If you have any questions please email <a href="mailto:${supportEmail}">${supportEmail}</a></p>`;

export const questions_text = `If you have any questions please email ${supportEmail}.`;

export const signature = `
<p>
  Cheers,<br>
  The ${siteName} Team
</p>
`;

export const signature_text = `Cheers, \nThe ${siteName} Team`;
