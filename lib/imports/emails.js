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
${registrationInfoHTML}
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

export const registrationInfoHTML = `
<p>
  <h4>Registration is a 4-step process:</h4>
  <ol>
    <li>
      Create account at <a target="_blank" href="${siteURL}/register">${siteURL}/register</a>.<br/>
      Verify your email before continuing.<br />
      Deadline: <strong>11:59 PM ${registrationCloseDate}</strong>
    </li>
    <li>
      Acquire ticket code(s) at <a target="_blank" href="https://commerce.cashnet.com/TheGreatPuzzleHunt${eventYear}">https://commerce.cashnet.com/TheGreatPuzzleHunt${eventYear}</a>.<br />
      Ticket code(s) will be sent to your email.<br />
      Deadline: <strong>9:30 AM ${eventDay}, ${eventDate}</strong>
    </li>
    <li>
      Redeem ticket code(s) at <a target="_blank" href="${siteURL}/redeem">${siteURL}/redeem</a>.<br/>
      Deadline: <strong>9:30 AM ${eventDay}, ${eventDate}</strong>
    </li>
    <li>
      Set-up/join team at <a target="_blank" href="${siteURL}/team">${siteURL}/team</a>.<br/>
    </li>
  </ol>
  <h4>Important Registration Information:</h4>
  <ul>
    <li>
      Participants are welcome to acquire extra ticket codes for others to redeem.
      <ul>
        <li>Anyone who gains access to a ticket code may redeem it.</li>
        <li>Each ticket code may be used only once.</li>
      </ul>
    </li>
    <li>Each participant must redeem a ticket code to complete their registration.</li>
    <li>Each member of a team must complete their registration for the team to participate.</li>
  </ul>
</p>
`;

export const questions = `<p>If you have any questions please email <a href="mailto:${supportEmail}">${supportEmail}</a></p>`;

export const questions_text = `If you have any questions please email ${supportEmail}.`;

export const signature = `
<p>
  Cheers,<br>
  The ${siteName} Team
</p>
`;

export const signature_text = `Cheers, \nThe ${siteName} Team`;
