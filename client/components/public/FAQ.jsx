import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { renderToString } from 'react-dom/server';
import { Link } from 'react-router-dom';
import LinkButton from '../imports/LinkButton';
import {
  Container,
  Accordion,
  List,
  Icon,
  Header,
  Message,
  Segment,
  Button,
  Image,
  Grid
} from 'semantic-ui-react';
import GamestateComp from '../imports/GamestateComp';

const { eventYear, eventDate, eventDay, siteName, earlyBirdLastDate, gearSaleEnd, registrationCloseDate, regularRegistrationStart, regularRegistrationEnd } = Meteor.settings.public;

let donationLink = `https://commerce.cashnet.com/TheGreatPuzzleHunt${eventYear}`;

const prizeNote = (
  <span>
    Must be present at awards ceremony to claim prizes.
  </span>
);
const wristbandNote = (
  <span>
    Must be wearing wristband to enter the free refreshments area.
  </span>
);

const gearPricing = (
  <span>
    <strong>Official Puzzle Gear Pricing</strong>
    {/* <ul>
      <li>Early Bird Discount Price (varying styles: prices range from $11-$27, additional $2 for extended sizes) until {earlyBirdLastDate}</li>
      <li>Regular Price (varying styles: prices range from $14-$30, additional $2 for extended sizes) begins {regularRegistrationStart} through {gearSaleEnd}</li>
      <li>Gear sale ends midnight {gearSaleEnd}</li>
      <li>The sale of these shirts helps to fund this event. Support the WWU Great Puzzle Hunt and wear our official Great Puzzle Hunt gear! Check out the styles, colors, and design. Pick up your shirts at event check-in.</li>
    </ul> */}
    <ul>
      <li>Prices on varying styles range from $20&ndash;$40, additional charges for extended sizes. Gear store open {regularRegistrationStart}&ndash;{gearSaleEnd}.</li>
      <li>Gear sales end midnight {gearSaleEnd}.</li>
      <li>Shirts will be ordered on Monday, April 28 and assuming no supply chain delays, should be shipped out or ready for pick-up by the end of the week of May 12, 2025.</li>
      <li>The sale of these shirts helps fund this event. Support the WWU Great Puzzle Hunt and wear our official Great Puzzle Hunt gear! Check out the styles, colors, and design.</li>
    </ul>
    <p> If you are able, please consider making a small donation (suggested $5 students, $10 nonstudents) and/or buying a shirt (our only fund raiser). Donations of any amount will help sustain this event. </p>

  </span>
);

const importantDates = (
  <List className='bulleted'>
    {/* <List.Item><strong>{earlyBirdLastDate}</strong>: Early Bird discount prices for ticket codes and official gear end.</List.Item> */}
    <List.Item><strong>{regularRegistrationStart}</strong>: Registration and Official Gear Store opens</List.Item>
    <List.Item><strong>{registrationCloseDate}</strong>: Step 1 of Registration (Create an Account) Closes - Or earlier if team limit is reached</List.Item>
    <List.Item><strong>{eventDate}</strong>: If you've already created an account, you can join a team until 10:00 AM (PT).</List.Item>
    <List.Item><strong>{gearSaleEnd}</strong>: Official Gear store closes at midnight.</List.Item>
  </List>
);

const schedule_inPerson_data = [
  {
    time: "9:30–10:15 AM",
    desc: "Red Square Check-in: Information packet, wristband*, swag bag. Photos for team costume competition. Rolls, coffee, cocoa, tea, fresh fruit. Free to registered participants. Thank you Haggen, and Dave Brown and Kendra Williams.",
  },
  {
    time: "10:15 AM",
    desc: "Red Square: Announcements."
  },
  {
    time: "10:30 AM",
    desc: "Red Square: Puzzle Hunt Starts."
  },
  {
    time: "1:00–3:00 PM",
    desc: "Red Square: Music. Pizza. Grab a slice or 2, cookies, & beverage between puzzles. Free to registered participants. Thank you, Domino's Pizza!"
  },
  {
    time: "3:30 PM",
    desc: "Food/Beverage Station closes.",
  },
  {
    time: "4:30 PM",
    desc: "Puzzle Stations close."
  },
  {
    time: "5:00 PM",
    desc: "Red Square: Award Ceremony & Prizes!**"
  },
]

const schedule_virtual_data = [
  {
    time: "9:30–10:15 AM (PT)",
    desc: "Check-in: Download and open information packet."
  },
  {
    time: "10:15 AM (PT)",
    desc: <span>Live Stream Announcements (<a href="#">link TBA</a>)</span>
  },
  {
    time: "10:30 AM (PT)",
    desc: "Puzzle Hunt Starts."
  },
  {
    time: "4:30 PM (PT)",
    desc: "Puzzle Hunt Ends."
  },
  {
    time: "5:00 PM (PT)",
    desc: <span>Leaderboard Posted, Live stream - claim your bragging rights! (<a href="#">link TBA</a>)</span>
  },
]

const schedule_inPerson = (
  <List bulleted>
    {schedule_inPerson_data.map((item, idx) => (
      <List.Item header={item.time} content={item.desc} key={idx}/>
    ))}
  </List>
);

const schedule_virtual = (
  <List bulleted>
    {schedule_virtual_data.map((item, idx) => (
      <List.Item header={item.time} content={item.desc} key={idx}/>
    ))}
  </List>
);

FAQ = class FAQ extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    $('html, body').scrollTop(0);
  }

  render() {
    const { activeIndex } = this.state;
    const gamestate = this.props.gamestate || {};
    return (
      <Container className="section">
      <Segment basic>
        <PuzzlePageTitle title="FAQ"/>


        <Accordion styled fluid>

          <Accordion.Title active={activeIndex === 0} index={0} onClick={(e,p) => this.handleClick(e,p)} >
            <Icon color="red" size="huge" name="dropdown"/>
            <Icon name="map"/>
            Directions & Parking
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 0}>
            <h2><Icon color="blue" name="tag"/> Address</h2>
            <List>
              <List.Item description="Western Washington University" />
              <List.Item description="516 High Street" />
              <List.Item description="Bellingham, WA 98225" />
            </List>
            <h2><Icon color="green" name="car"/> Parking</h2>
            <List>
              <List.Item description="Parking is FREE in the C-Lots on south campus on weekends." />
              <List.Item description="Go to Red Square in the middle of campus for: Check-in, food (courtesy of Haggen and Domino's Pizza), coffee (courtesy of Dave Brown and Kendra Williams), and Awards Ceremony." />
            </List>
            <Button as='a' href="http://www.wwu.edu/map/" target="_blank" content="Interactive Campus Map" />

            <h2><Icon color="blue" name="map"/> Directions from the South</h2>
            <List bulleted>
              <List.Item description="From Interstate 5, take exit 252."/>
              <List.Item description="Turn left off the ramp onto S. Samish Way."/>
              <List.Item description="Turn left at the stop light onto N. Samish Way."/>
              <List.Item description="Stay in the left lane and go over the freeway."/>
              <List.Item description="At the second light, turn left onto Bill McDonald Parkway/Byron Avenue – there will be a Wendy's and a 76 Station on your left."/>
              <List.Item description="Drive on Bill McDonald Parkway for just over 1 mile and continue straight through two stop lights (you will still be on the Bill McDonald Parkway)."/>
              <List.Item description="The Campus Services Building will be the first building on the right after the intersection."/>
              <List.Item description="The C-Lots will be the next left and right turns."/>
            </List>

            <h2><Icon color="green" name="map"/> Directions from the North</h2>
            <List bulleted>
              <List.Item description="From Interstate 5 going south, take exit 252 and get in the right lane."/>
              <List.Item description="Turn right off the ramp onto N. Samish Way, and get into the far left turn lane."/>
              <List.Item description="At the light, turn left onto Bill McDonald Parkway/Byron Avenue - there will be a Wendy's and a 76 Station on your left."/>
              <List.Item description="Drive on Bill McDonald Parkway for just over 1 mile and continue straight through two stop lights (you will still be on the Bill McDonald Parkway)."/>
              <List.Item description="The Campus Services Building will be the first building on the right after the intersection"/>
              <List.Item description="The C-Lots will be the next left and right turns."/>
            </List>

            <br/>

            <iframe frameBorder="0" height="450" src="https://www.google.com/maps/embed/v1/place?key=AIzaSyDzFT6fltUNTF7Vas25IJmMkUAa5yVPi4I&amp;q=Campus+Services+Bellingham+WA" width="100%" />
          </Accordion.Content> 

          <Accordion.Title active={activeIndex === 2} index={2} onClick={(e,p) => this.handleClick(e,p)} >
            <Icon color="red" size="huge" name="dropdown"/>
            <Icon name="info"/>
            What is the WWU Great Puzzle Hunt?
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 2}>
            The annual WWU Great Puzzle Hunt is a fun, full-day, team puzzle-solving event that is <strong>OPEN TO ALL!</strong>
            <List bulleted>
              <List.Item>Teams of up to 6 (recommended size 4-6) work virtually or travel on foot about WWU campus (outdoors) solving a collection of puzzles involving logic, patterns, decoding, and a variety of skill sets.</List.Item>

              <List.Item><strong>Your mission</strong>: HAVE FUN!
                <List.List>
                  <List.Item><strong>In-Person teams</strong>: Reach the outdoor location shown on your smartphone and scan your team code (which starts clock) to receive a puzzle. </List.Item>
                  <List.Item><strong>Virtual teams</strong>: Check in on morning of Hunt to download the info packet. At START time, select the first puzzle to download and start the team clock. </List.Item>
                  <List.Item>You’ll need your wizard bag (scissors, tape, hole punch, etc.), as well as critical thinking, reasoning, and teamwork to MacGyver your way through. Once you solve the puzzle and enter the code word(s), the clock stops, and (in-person) &ndash; you are sent to the next destination or (virtual) &ndash; you may open the next puzzle. Connect all the code words to complete the game!</List.Item>
                </List.List>
              </List.Item>
              <List.Item>The four main puzzles pertain to (1) Arts (Visual and Performing), (2) Sciences, (3) Humanities, and (4) the fourth puzzle is from a different academic discipline each year – past puzzle 4 topics included Paper Folding, Geometry, and Communication. Each person on the team is important and has special input to share. Choose a versatile team!</List.Item>
              <List.Item>Registered teams gain access to the Puzzle Hunt game platform (owned and built by WWU students) via smartphone or computer.</List.Item>
              <List.Item>Prizes are awarded to <em>in-person</em> top scoring teams in each division, best in-person costumes, and team names. Must be present at awards ceremony to claim prizes.</List.Item>
              <List.Item>Whether your team places first or two hundred and fifty-first, competing in the puzzle hunt is a great way to stretch your mental muscles, bond with your teammates, and have a lot of fun!</List.Item>
            </List>
            {/* virtualeventonly
            <strong>* </strong>{prizeNote}
             */}
          </Accordion.Content>

          <Accordion.Title active={activeIndex === 16} index={16} onClick={(e, p) => this.handleClick(e, p)} >
            <Icon color="orange" name="dropdown" />
            <Icon name="bullseye"/>
            Mission Statement
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 16}>
            Our goal is to mobilize minds, highlight connections between different fields, and break down imagined barriers to STEM fields by building puzzles that require versatility, persistence, patience, and teamwork to solve. While it is at its core a competitive event, we aim to make it fun and accessible to everyone. We support critical thinking, teamwork, technology, and encourage inclusion.
          </Accordion.Content>

          <Accordion.Title active={activeIndex === 3} index={3} onClick={(e,p) => this.handleClick(e,p)} >
            <Icon color="orange" size="huge" name="dropdown"/>
            <Icon name="users"/>
            How many people should be on my team?
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 3}>
            A maximum of 6 people are allowed on a team.
            <br /><br />
            We recommend 4-6 people on a team. It can be an advantage to divvy up the work (cutting, constructing, googling, etc.).
          </Accordion.Content>
          <Accordion.Title active={activeIndex === 17} index={17} onClick={(e,p) => this.handleClick(e,p)} >
            <Icon color="yellow" name="dropdown" />
            <Icon name="user"/>
            Don't have a team?
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 17}>
            That's okay! After you create an account, you can use our "matchmaking" feature to find an open team to join
            or other players who are also looking for a team. Then, visit the <Link to="/profile">Profile</Link> page to
            select one of two options:<br /><br />

            <strong>Browse players looking for a team:</strong> Select this option to see other players who are
            currently "solo" but would like to find other players to form a new team with. You can send them a message to
            decide if you'd be a good fit.<br /><br />

            <strong>Browse teams looking for more members:</strong> Select this option to see teams that are short a few
            members and are actively recruiting new players. Send a message to their team captain to get in touch. The
            team captain can then share the Team Password so you can join that group.<br /><br />

            <strong>A few things to note:</strong>
            <List>
              <List.Item>
                When exchanging messages with other players or team captains, your email address may be shared with
                whoever you contact.
              </List.Item>
              <List.Item>
                Be sure to check the Virtual or In-Person setting for a team you're interested in joining. If that team
                is planning to play in-person but you can't be there physically, this could be a problem!
              </List.Item>
            </List>
          </Accordion.Content>
          <Accordion.Title active={activeIndex === 4} index={4} onClick={(e,p) => this.handleClick(e,p)} >
            <Icon color="yellow" name="dropdown"/>
            <Icon name="calendar"/>
            When is it? (Event Schedule)
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 4}>
            <h3>
              <strong>{eventDay}, {eventDate}</strong> at 9:30 AM (PT)
            </h3>
            Other important dates:
            {importantDates}

            Schedule for the day:
            <Header as='h2'>In-Person</Header>
            {schedule_inPerson}
            <strong>* </strong>{wristbandNote}
            <br />
            <strong>** </strong>{prizeNote}

            <Header as='h2'>Virtual</Header>
            {schedule_virtual}
            {/* <strong>** </strong>{prizeNote} */}
          </Accordion.Content>

          <Accordion.Title active={activeIndex === 5} index={5} onClick={(e,p) => this.handleClick(e,p)} >
            <Icon color="yellow" name="dropdown"/>
            <Icon name="user"/>
            Who is it for?
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 5}>
            <List bulleted>
              <List.Item>Students, Faculty, Staff, Alumni, Community, Family, Everyone, Anywhere!</List.Item>
              <List.Item>Each team with participant(s) under age 14 must include at least one registered adult team member to accompany minor(s) at all times.</List.Item>
              <List.Item>Participants under 18 who are not enrolled WWU students: A parent/legal guardian must complete the registration form on behalf of their minor.</List.Item>
            </List>
            {/* <strong>*</strong> Children under 14 must be accompanied at all times by a parent/legal guardian who must also be registered on the same team as the child. */}
            {/* *Each participant under age 14 must have permission from a parent/legal guardian. The puzzles are created for ages 14 and older. */}
          </Accordion.Content>

          <Accordion.Title active={activeIndex === 6} index={6} onClick={(e,p) => this.handleClick(e,p)} >
            <Icon color="olive" name="dropdown"/>
            <Icon name="sitemap"/>
            What team divisions are there?
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 6}>
            <List className='bulleted'>
              <List.Item 
                header="Post-secondary Students"
                description="All team members must be currently enrolled in a post-secondary institution - undergrad or grad (college, university, technical school, etc.)."
              />
              <List.Item
                header="WWU Alumni"
                description="At least half of team members must be WWU Alumni."
              />
              {/*
              <List.Item 
                header="Postsecondary Students"
                description="All team members must be currently enrolled in college (undergrad or grad), technical school, running start. Mix and match-team members from same or different schools."
              />
              */}
              <List.Item
                header="Secondary Students"
                description="All team members must be currently enrolled in middle school or high school. Exception: One adult chaperone per team may register as a team member."
              />
              <List.Item 
                header="Open"
                description="General public, mixed student/non-student, family (participants under age 14 must have permission from parent/guardian)."
              />
            </List>
            {/* virtualeventonly
            <List className='bulleted'>
              <List.Item
                header="WWU Students"
                description="All team members must be currently enrolled at WWU (undergrad or grad)."
              />
              <List.Item
                header="High School"
                description="All team members must be currently enrolled in high school. Exception: One adult chaperone per team may register as a team member."
              />
              <List.Item
                header="WWU Alumni"
                description="At least half of team members must be WWU Alumni."
              />
              <List.Item
                header="Open"
                description="General public, mixed student/non-student, family (children under age 14 must be accompanied by a parent/guardian)."
              />
              <br />
            <span>Contact us to:</span>
            <List.Item
                header="Create a Division*"
                description="Examples: Family Division, COVID Pod, or Club (Dance, Running, Book, Garden, Wine, &#x2026;) where team members are family or in that club."
             />
             </List> 
             */}
             <p>* A minimum of 10 teams are required to form a division; else the teams in that division may merge with another division.</p>
            <hr />

            <strong>Note:</strong> All teams may have up to 6 members. We recommend 4-6 for dividing up tasks.
          </Accordion.Content>

          <Accordion.Title active={activeIndex === 7} index={7} onClick={(e,p) => this.handleClick(e,p)} >
            <Icon color="olive" name="dropdown"/>
            <Icon name="trophy"/>
            Prizes?
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 7}>
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
            {/* <strong>* </strong>{prizeNote} */}
          </Accordion.Content>

          <Accordion.Title active={activeIndex === 8} index={8} onClick={(e,p) => this.handleClick(e,p)} >
            <Icon color="green" name="dropdown"/>
            <Icon name="dollar"/>
            How much does this cost?
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 8}>
            {/* virtualeventonly
            <p>
              Registration Prices are per person. All fees are non-refundable. Fees charged when person buys ticket codes.<br/>
              You can SAVE on the early bird discount prices!
            </p>
            <strong>Ticket Code Pricing</strong>
            <ul>
              <li>Early Bird Discount Price ($5 student/$10 non-student) until {earlyBirdLastDate}.</li>
              <li>Regular Price ($8 student/$15 non-student) {regularRegistrationStart} through {regularRegistrationEnd}.</li>
            </ul>
            {gearPricing}
            <p>
              These fees are kept low thanks to generous donations from our sponsors.
              They help cover costs of materials, prizes*, food, campus services
              & reservations, etc.
            </p>
            {prizeNote}
            <p>
              Please consider <a target="_blank" href="https://alumni.wwu.edu/greatpuzzlehunt">donating to the {siteName}</a>.
            </p> 
            */}
            
            <p>We know people are stretched in these times. We want to provide a safe, no cost, educational, fun activity accessible to all. Registration is FREE. </p>
            <p>If you are able, please consider making a small donation (suggested $5 students, $10 nonstudents) and/or buying a shirt (our only fund raiser). Donations of any amount will help keep us afloat!  The WWU Great Puzzle Hunt operates under WWU Foundation's 501(c)(3) status, so all donations are tax deductible. </p>
            <LinkButton as='a'
                href="https://foundation.wwu.edu/greatpuzzlehunt"
                size='large'  content='Donate Online'
                icon={<Icon name='heart'/>}
                color="green"
              />
          </Accordion.Content>

          <Accordion.Title active={activeIndex === 9} index={9} onClick={(e,p) => this.handleClick(e,p)} >
            <Icon color="green" name="dropdown"/>
            <Icon name="suitcase"/>
            What should I have on hand?
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 9}>
            <Message error>
              <em>Note: this information is from 2024 and may be adjusted for the 2025 Hunt.</em>
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
              <List.Item> If your team members are playing from separate locations, you can try <a href='https://jamboard.google.com/'>Google Jamboard</a> for a free interactive whiteboard. </List.Item>
            </List>
          </Accordion.Content>

          <Accordion.Title active={activeIndex === 10} index={10} onClick={(e,p) => this.handleClick(e,p)} >
            <Icon color="teal" name="dropdown"/>
            <Icon name="flask"/>
            Do I have to be a math/science person?
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 10}>
            NO! A common misconception is that only mathematically inclined people are good at solving puzzles.
            In this puzzle hunt, it will be to your advantage to have people on your team with
            knowledge of music, art, humanities and social sciences, as well as science and mathematics.
          </Accordion.Content>

          <Accordion.Title active={activeIndex === 12} index={12} onClick={(e,p) => this.handleClick(e,p)} >
            <Icon color="teal" name="dropdown"/>
            <Icon name="food"/>
            Food?
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 12}>
            <p>
              Yes, for in-person participants! To enter the free refreshments area, <strong>you must be wearing your wristband</strong> at all times.
              <br/>
              Wristbands are distributed at check-in.
            </p>
            <p>
              Coffee, tea, cocoa, and light refreshments will be available in front of Miller Hall (in Red Square) from 9:30 AM - 3:30 PM, while supplies last.
            </p>
	    <p><em> Be sure to bring snacks if you have special dietary needs.</em></p>
            <List>
              <List.Item description="9:30 AM - Check in/receive wristband. Refreshment* area opens along Miller Hall."/>
              <List.Item description="1:00 - 3:00 PM - Domino’s Pizza arrives in Red Square"/>
              <List.Item description="3:30 PM - Food/Beverage Station closes"/>
	      <p>
		Special thanks to Haggen, Domino's Pizza, and Dave Brown and Kendra Williams.
            </p>	      
            </List>
            * Fresh fruit, rolls, coffee, cocoa, tea
          </Accordion.Content>

          <Accordion.Title active={activeIndex === 13} index={13} onClick={(e,p) => this.handleClick(e,p)} >
            <Icon color="blue" name="dropdown"/>
            <Icon name="rain"/>
            What if it rains?
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 13}>
            Welcome to Washington.  We hunt on!
          </Accordion.Content> 

          <Accordion.Title active={activeIndex === 14} index={14} onClick={(e,p) => this.handleClick(e,p)} >
            <Icon color="blue" name="dropdown"/>
            <Icon name="puzzle"/>
            What kind of puzzles will we be solving?
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 14}>
            Check out <Link to="/puzzles">past puzzles</Link>!
          </Accordion.Content>

          <Accordion.Title active={activeIndex === 15} index={15} onClick={(e,p) => this.handleClick(e,p)} >
            <Icon color="purple" name="dropdown"/>
            <Icon name="shop"/>
            What does the Gear/Apparel look like?
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 15}>
            <Grid stackable>
              <Grid.Row>
                <Grid.Column width={10}>
                  { gamestate && gamestate.buyGear ? <p>Take a look at our gear and order <a href="/gear">here</a>.</p> : <p>The Great Puzzle Hunt Gear store is currently closed. Opens {regularRegistrationStart}.</p>}
                  <p>There are 13 style choices, wonderful colors, and an awesome design!</p>
                  {gearPricing}
		<LinkButton as='a'
			    href="https://foundation.wwu.edu/greatpuzzlehunt"
			    size='large'  content='Donate Online'
			    icon={<Icon name='heart'/>}
			    color="green"
		/>
		{ gamestate && gamestate.buyGear ?	    
		  <LinkButton as='a' href="/gear"
			      size="large" color="orange" target="_blank"
			      icon={<Icon name="shopping cart" />}
			      content="Buy Gear"
		  />
		  : "" }
                </Grid.Column>
                <Grid.Column width={6}>
                  <Image src={`https://gph-distributed.s3.us-west-2.amazonaws.com/${eventYear}/gear/shirt_design_background.png`}/>
                </Grid.Column>

              </Grid.Row>

            </Grid>
          </Accordion.Content>
          
          <Accordion.Title active={activeIndex === 18} index={18} onClick={(e,p) => this.handleClick(e,p)} >
            <Icon color="purple" name="dropdown"/>
            <Icon name="dollar"/>
            How can I support the Great Puzzle Hunt?
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 18}>
            <p> We keep this event free to you thanks to generous donations from our sponsors, and from gear purchases. These contributions help cover costs of this event including web fees and development, graphics, prizes, advertising, and much more. </p>
            <p>You can help out by:
              <ul>
                <li> Donating any amount. $5 and $10 donations make a difference. </li>
                 <li> Purchasing a shirt!</li>
		<li> Volunteering!* It takes a team to make the Puzzle Hunt happen, and we are grateful for everyone who helps out.</li>
	      </ul>
	    </p> 
            <p> The WWU Great Puzzle Hunt operates under WWU Foundation's 501(c)(3) status, so all donations are tax deductible. </p>
            <p> <strong>*</strong> Volunteers choose the "volunteer" account type when <a href="/register">registering</a>. Questions? Contact <a href="mailto:info@greatpuzzlehunt.com">info@greatpuzzlehunt.com</a>. </p>
            <LinkButton as='a'
              href="https://foundation.wwu.edu/greatpuzzlehunt"
              size='large'  content='Donate Online'
              icon={<Icon name='heart'/>}
              color="green"
            />
            { gamestate && gamestate.buyGear ?	    
              <LinkButton as='a' href="/gear"
			  size="large" color="orange" target="_blank"
			  icon={<Icon name="shopping cart" />}
			  content="Buy Gear"
              />
	      : "" }
          </Accordion.Content>

        </Accordion>

        <br/>
        <p>Last Updated: November 2024</p>
      </Segment>
      </Container>
    );
  }

  handleClick(e, titleProps) {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = (activeIndex === index) ? -1 : index;
    this.setState({ activeIndex: newIndex });
  }

  _downloadButtons() {
    return (
      <List relaxed>
        <List.Item>
          <a href="/pdfs/2017/2017_GPH_rules_of_play.pdf" target="_blank"><Icon name="download"/>2017 Rules of Play & Scoring</a>
        </List.Item>
        <List.Item>
          <a href="/pdfs/2017/puzzle-hunt-map.pdf" target="_blank"><Icon name="download"/>2017 Puzzle Campus Map</a>
        </List.Item>
      </List>
    );
  }
}

FAQ = GamestateComp(FAQ);

