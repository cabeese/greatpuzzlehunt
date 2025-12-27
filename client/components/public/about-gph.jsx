import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import LinkButton from '../imports/LinkButton';
import {
  Container,
  Header,
  Segment,
  Button,
  Image,
  Message,
  List,
  Grid,
} from 'semantic-ui-react';
import {
  getAnchorName,
  puzzle_schedule_virtual_data,
  puzzle_schedule_inPerson_data,
  Parking,
  Directions,
  AboutGear,
  Support,
} from './imports/common-details';
import Rules from './imports/rules';

class AboutGph extends Component {
  // ==================================================================
  // ==================== Section Body Definitions ====================
  // ==================================================================
  _missionStatement() {
    return (
      <div>
        <p>
          Our goal is to mobilize minds, highlight connections between
          different fields, and break down imagined barriers to STEM
          fields by building puzzles that require versatility,
          persistence, patience, and teamwork to solve.
        </p>

        <p>
          While it is at its core a competitive event, we aim to make
          it fun and accessible to everyone. We support critical
          thinking, teamwork, technology, and encourage inclusion.
        </p>

        <h3>TODO(noah): ADD PHOTO</h3>
      </div>
    );
  }

  _gameDetails() {
    return (
      <div>
        <h2>
        The annual WWU Great Puzzle Hunt is a fun, full-day,
        team puzzle-solving event that is OPEN TO ALL!
        </h2>

        <p>
          Teams of up to 6 (recommended size 4-6) work virtually
          or travel on foot about WWU campus (outdoors) solving
          a collection of puzzles involving logic, patterns,
          decoding, and a variety of skill sets.
        </p>

        <p>
          The four main puzzles pertain to
          <br />(1) Arts (Visual and Performing), 
          <br />(2) Sciences, 
          <br />(3) Humanities, 
          <br />(4) the fourth puzzle is from a different academic discipline each year 
        </p>

        <p>
          Past puzzle topics included Paper Folding, Geometry, and
          Communication. Each person on the team is important and has
          special input to share. Choose a versatile team!
        </p>

        <Button as="a"
                basic color='blue' size='small'
                href={"puzzles"}>
          Explore Past Puzzles
        </Button>
        <br /><br />

        <p>
          Registered teams gain access to the Puzzle Hunt game
          platform (owned and built by WWU students) via smartphone or
          computer.
        </p>

        <p>
          Prizes are awarded to in-person top scoring teams in each
          division, best in-person costumes, and team names. Must be
          present at awards ceremony to claim prizes.
        </p>

        <p>
          Whether your team places first or two hundred and
          fifty-first, competing in the puzzle hunt is a great way to
          stretch your mental muscles, bond with your teammates, and
          have a lot of fun!
        </p>
      </div>
    );
  }

  _teams() {
    return (
      <div>
        <p>
          A maximum of 6 people are allowed on a team.
        </p>

        <p>
          We recommend 4-6 people on a team. It can be an advantage
          to divvy up the work (cutting, constructing, googling,
          etc.)..
        </p>

        <h3>Don’t have a team?</h3>

        <p>
          That's okay! After you create an account, you can use our
          "matchmaking" feature to find an open team to join or other
          players who are also looking for a team. Then, visit
          the <a href="profile">Profile</a> page to select one of two options:
        </p>

        <p>
          <strong>Browse players looking for a team:</strong> Select this option to see other
          players who are currently "solo" but would like to find
          other players to form a new team with. You can send them a
          message to decide if you'd be a good fit.
        </p>

        <p>
          <strong>Browse teams looking for more members:</strong> Select
          this option to see teams that are short a few members and
          are actively recruiting new players. Send a message to their
          team captain to get in touch. The team captain can then
          share the Team Password so you can join that group.
        </p>

        <p>
          <strong>A few things to note:</strong>
          <br />When exchanging messages with other players or team
          captains, your email address may be shared with whoever you
          contact.
          <br />Be sure to check the Virtual or In-Person
          setting for a team you're interested in joining. If that
          team is planning to play in-person but you can't be there
          physically, this could be a problem!
        </p>

        <Button as="a"
                basic color='blue' size='small'
                href={"teams-list"}>
          Explore Teams
        </Button>

        <h3>In-Person teams:</h3>
        <p>Reach the outdoor location shown on your smartphone and scan your
          team code (which starts clock) to receive a puzzle.</p>

        <h3>Virtual teams:</h3>
        <p>
          Check in on morning of Hunt to download the info packet. At
          START time, select the first puzzle to download and start
          the team clock.
        </p>
        <p>
          You’ll need your wizard bag (scissors, tape, hole punch,
          etc.), as well as critical thinking, reasoning, and teamwork
          to MacGyver your way through. Once you solve the puzzle and
          enter the code word(s), the clock stops, and (in-person) –
          you are sent to the next destination or (virtual) – you may
          open the next puzzle. Connect all the code words to complete
          the game!
        </p>

        <h3>Team Divisions</h3>
        <p>
          <strong>Post-secondary Students</strong><br />
          All team members must be currently enrolled in a post-secondary
          institution - undergrad or grad (college, university, technical school, etc.).
        </p>

        <p>
          <strong>WWU Alumin</strong><br />
          At least half of team members must be WWU Alumni.
        </p>

        <p>
          <strong>Secondary Students</strong><br />
          All team members must be currently enrolled in middle school or high
          school. Exception: One adult chaperone per team may register as a team
          member.
        </p>

        <p>
          <strong>Open</strong><br />
          General public, mixed student/non-student, family
          (participants under age 14 must have permission from
          parent/guardian).
        </p>

        <p>
          * A minimum of 10 teams are required to form a division;
          else the teams in that division may merge with another division.
        </p>

        <p>
          <strong>
             Note: All teams may have up to 6 members. We recommend 4-6 for dividing up tasks.
          </strong>
        </p>
      </div>
    );
  }

  _tools() {
    return (
      <div>
        <Message error>
          <em>Note: this information is from 2025 and may be adjusted for the 2026 Hunt.</em>
	</Message>
        Your creativity and problem-solving skills! Along with the following:<br />
        <List bulleted>
          <List.Item><span className="description">At least one smartphone or computer. The more the better! (think about battery life).</span>
            <List.List>
              <List.Item description="Used for inputting code words, Googling, communicating with your team, and more!" />
            </List.List>
          </List.Item>

          <List.Item description="A clip board, or a notepad" />
          <List.Item description="Ruler/Straightedge" />
          <List.Item description="Scissors" />
          <List.Item description="Transparent Tape (like Scotch Tape)" />
          <List.Item description="Writing utensils (pencils, pens, erasers, felt-tips, highlighters)" />
          <List.Item description="Colored Pencils" />
          <List.Item description="Light source (a window and daylight works wonderfully)" />
          <List.Item description="Push pin or tack, with a piece of cardboard or pad of paper to push pin into (or an end of a paper clip can work, though less efficient)" />
          <List.Item description="Water bottle, snacks (Be sure to bring snacks if you have special dietary needs)" />
          <List.Item description="Umbrella" />
        </List>
        Additional items for <strong>virtual</strong> participants:
        <List bulleted>
          <List.Item><span className="description"><a href="https://zoom.us/">Zoom</a> software downloaded (no account needed)</span>
            <List.List>
              <List.Item description="Will be used by event leaders for announcements, prizes, and troubleshooting. A link to join the Zoom session will be provided on the website on game day." />
            </List.List>
          </List.Item>
          <List.Item><span className="description">Printer (a color printer might be helpful)</span>
            <List.List>
              <List.Item description="You will want hard copies of most puzzles to fold, cut, etc." />
            </List.List>
          </List.Item>
          <List.Item description="Water to drink and a sack lunch or snacks." />
        </List>
      </div>
    );
  }

  _prizes() {
    return (
      <div>
        <p>
          Prizes will be awarded to top scoring <em>in-person</em> teams in each division.
          Other prizes for best in-person team names, costumes, and more!
        </p>
        <p>
          Must be present at awards ceremony to claim prizes.
        </p>
        <p>
          Virtual team prizes will be to claim bragging rights!
        </p>
      </div>
    );
  }

  _food() {
    return (
      <div>
        <p>
          Yes, for in-person participants! To enter the free refreshments
          area, <strong>you must be wearing your wristband</strong> at all times.
          <br/>
          Wristbands are distributed at check-in.
        </p>
        <p>
          Coffee, tea, cocoa, and light refreshments will be available in front of
          Miller Hall (in Red Square) from 9:30 AM - 3:00 PM, while supplies last.
        </p>
	<p><em> Be sure to bring snacks if you have special dietary needs.</em></p>
        <List>
          <List.Item description="9:30 - 10:15 AM - Check in/receive wristband. Refreshment* area opens along Miller Hall."/>
          <List.Item description="12:30 - 2:30 PM - Domino’s Pizza arrives in Red Square"/>
          <List.Item description="3:00 PM - Food/Beverage Station closes"/>
        </List>

	<p>
	  Special thanks to Haggen, Domino's Pizza, Dave Brown, and Kendra Williams.
        </p>
        * Fresh fruit, rolls, coffee, cocoa, tea
      </div>
    );
  }

  _parking() {
    return (
      <div>
        <Parking />

        <p>
          Go to Red Square in the middle of campus for: Check-in, food
          (courtesy of Haggen and Domino's Pizza), coffee (courtesy of
          Dave Brown and Kendra Williams), and Awards Ceremony.
        </p>
      </div>
    );
  }

  _register() {
    return (
      <div>
        <p>
          Registration is FREE and open to all, anywhere in the
          world. Donations are gratefully accepted.
        </p>

        <p>
          Participants under age 18 who are not enrolled WWU students:
          A parent/legal guardian must complete the registration form
          on behalf of their minor.
        </p>
      </div>
    );
  }

  _schedule() {
    return (
      <Grid stackable columns={2}>
        <Grid.Column>
          <Header as="h3">In-Person Teams</Header>
          {puzzle_schedule_inPerson_data.map(({time, desc}) => (
            <div key={time}>
              <strong>{time}</strong>
              <br />

              <p>{desc}</p>
            </div>
          ))}
        </Grid.Column>

        <Grid.Column>
          <Header as="h3">Virtual Teams</Header>
          {puzzle_schedule_virtual_data.map(({time, desc}) => (
            <div key={time}>
              <strong>{time}</strong>
              <br />

              <p>{desc}</p>
            </div>
          ))}
        </Grid.Column>
      </Grid>
    );
  }

  _gear() {
    return (
      <AboutGear />
    );
  }

  _support() {
    return (
      <div>
      </div>
    );
  }
  // ==================================================================
  // ================= End of Section Body Definitions ================
  // ==================================================================

  // Map of `Section Name` -> `Section Body Component`.
  // Order of this map determines rendering order.
  SECTION_MAP = {
    "Game Details": this._gameDetails(),
    "Rules": <Rules />,
    "Teams": this._teams(),
    "Tools": this._tools(),
    "Prizes": this._prizes(),
    "Food": this._food(),
    "Parking": this._parking(),
    "Directions": <Directions />,
    "Register": this._register(),
    "Schedule": this._schedule(),
    "Gear": <AboutGear />,
    "Support": <Support />,
  }

  render() {
    return (
      <Container>
        {/* Page title */}
        <Header as="h1" size="medium">
          The Great Puzzle Hunt
        </Header>

        {/* Render links to anchors on the page */}
        {Object.keys(this.SECTION_MAP).map(name => {
          const target = getAnchorName(name);
          // TODO: use JS to scroll and fix offset from header
          // https://www.geeksforgeeks.org/html/offsetting-an-anchor-to-adjust-for-fixed-header/
          return (
            <Button as="a" key={target}
                    basic color='blue' size='small'
                    href={`#${target}`}>
              {name}
            </Button>
          );
        })}

        {/* Render each section (including header and anchor) */}
        <Segment>
          {Object.entries(this.SECTION_MAP).map(([name, body]) => (
            <React.Fragment key={name}>
              <Header as="h1" size="medium">
                <a id={getAnchorName(name)} />
                {name}
              </Header>

              {body}
            </React.Fragment>
          ))}
        </Segment>
      </Container>
    );
  }
};

export default AboutGph;
