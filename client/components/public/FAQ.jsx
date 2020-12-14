import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { renderToString } from 'react-dom/server';
import { Link } from 'react-router';
import {
  Container,
  Accordion,
  List,
  Icon,
  Header,
  Message,
  Segment,
  Button,
  Image
} from 'semantic-ui-react';

const { eventYear, eventDate, siteName, earlyBirdLastDate, gearSaleEnd, registrationCloseDate, regularRegistrationStart, regularRegistrationEnd } = Meteor.settings.public;

const prizeNote = (
  <span>
    Must be present at awards ceremony to claim prizes, else prizes go to the next place team.
  </span>
);
const wristbandNote = (
  <span>
    Must be wearing wristband to enter the free refreshments area.
  </span>
);

const gearPricing = (
  <span>
    <strong>Official Puzzle Gear Pricing (See <a href="/gear">gear</a>)</strong>
    {/* <ul>
      <li>Early Bird Discount Price (varying styles: prices range from $11-$27, additional $2 for extended sizes) until {earlyBirdLastDate}</li>
      <li>Regular Price (varying styles: prices range from $14-$30, additional $2 for extended sizes) begins {regularRegistrationStart} through {gearSaleEnd}</li>
      <li>Gear sale ends midnight {gearSaleEnd}</li>
      <li>The sale of these shirts helps to fund this event. Support the WWU Great Puzzle Hunt and wear our official Great Puzzle Hunt gear! Check out the styles, colors, and design. Pick up your shirts at event check-in.</li>
    </ul> */}
    <ul>
      <li>Prices on varying styles range from $14&ndash;$30, additional $2 for extended sizes. Gear store open {regularRegistrationStart}&ndash;{gearSaleEnd}. <b>FREE Domestic shipping. Discounted international shipping. Bonus: cool swag included with every shipment!</b></li>
      <li>Gear sales end midnight {gearSaleEnd}</li>
      <li>The sale of these shirts helps to fund this event. Support the WWU Great Puzzle Hunt and wear our official Great Puzzle Hunt gear! Check out the styles, colors, and design.</li>
    </ul>
    <p>
      These fees are kept low thanks to generous donations from our sponsors. They help cover costs of this event including web fees and development, graphics, prizes, advertising, and much more.
    </p>
    <p>
      Please consider <a target="_blank" href="https://foundation.wwu.edu/greatpuzzlehunt">donating to the Great Puzzle Hunt</a>.
    </p>
    <p>
    The WWU Great Puzzle Hunt operates under WWU Foundation's 501(c)(3) status, so all donations are tax deductible. 
    </p>

  </span>
);

const importantDates = (
  <List className='bulleted'>
    {/* <List.Item><strong>{earlyBirdLastDate}</strong>: Early Bird discount prices for ticket codes and official gear end.</List.Item> */}
    <List.Item><strong>{regularRegistrationStart}</strong>: Registration and Official Gear Store opens</List.Item>
    <List.Item><strong>{registrationCloseDate}</strong>: Step 1 of Registration (Create an Account) Closes - Or earlier if team limit is reached</List.Item>
    <List.Item><strong>{eventDate}</strong>: If you've already created an account, you can acquire, redeem ticket code(s), and join a team until 10:00 AM (PST).</List.Item>
    <List.Item><strong>{gearSaleEnd}</strong>: Official Gear store closes. <b>Free Domestic shipping + Bonus: cool swag included with every shipment!</b></List.Item>
  </List>
);

const schedule_data = [
  {
    time: "9:30–10:15 AM (PST)",
    // desc: "Check-in: Information packet, wristband*, swag bag, pre-ordered shirts. Photos for team costume competition. Rolls, coffee, cocoa, tea, fresh fruit. Free to registered participants. Thank you, Haggen!",
    desc: "Check-in: Download info packet and all puzzles plus meta puzzle. ALL PUZZLES ARE CODE PROTECTED. Packet can be opened upon download."
  },
  {
    time: "10:15 AM (PST)",
    desc: <span>Live Stream Announcements (<a href="#">Link TBA</a>)</span>
  },
  {
    time: "10:30 AM (PST)",
    // desc: "Red Square: Announcements."
    desc: "Puzzle Hunt Starts. Enter team code to open a downloaded puzzle."
  },
  {
    time: "4:30 PM (PST)",
    // desc: "Red Square: Puzzle Hunt starts!"
    desc: "Puzzle Hunt Ends."
  },
  {
    time: "5:00 PM (PST)",
    // desc: "Red Square: KUGS Radio plays music. Domino's pizza. Grab a slice or 2, cookies, & beverage between puzzles. Free to registered participants."
    desc: <span>Leaderboard Posted, Live stream—Prizes Awarded! (<a href="#">Link TBA</a>)</span>
  },
  // {
  //   time: "4:25 PM",
  //   desc: "Puzzle Stations close. Finish Puzzles and return to Red Square."
  // },
  // {
  //   time: "4:30 - 5:00 PM",
  //   desc: "Red Square: Award Ceremony & Prizes**!"
  // },
]

const schedule = (
  <List>
    {schedule_data.map((item, idx) => (
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
    return (
      <Container>
        <PuzzlePageTitle title="FAQ"/>

        <Accordion styled fluid>

          {/* virtualeventonly
          <Accordion.Title active={activeIndex === 1} index={1} onClick={(e,p) => this.handleClick(e,p)} >
            <Icon color="red" size="huge" name="dropdown"/>
            <Icon name="map"/>
            Directions & Parking
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 1}>
            <Header as='h3' icon={<Icon color="blue" name="tag"/>} content="Address" />
            <List>
              <List.Item description="Western Washington University" />
              <List.Item description="516 High Street" />
              <List.Item description="Bellingham, WA 98225" />
            </List>
            <Header as='h3' icon={<Icon color="green" name="car"/>} content="Parking" />
            <List>
              <List.Item description="Parking is FREE in all C-Lots on south campus on weekends." />
              <List.Item description="Go to Red Square in the middle of campus for: Check-in, food, coffee (courtesy of Haggen NW Fresh), and Awards Ceremony." />
            </List>
            <Button as='a' href="http://www.wwu.edu/map/" target="_blank" content="Interactive Campus Map" />

            <Header as='h3' icon={<Icon color="blue" name="map"/>} content="Directions from the South" />
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

            <Header as='h3' icon={<Icon color="green" name="map"/>} content="Directions from the North" />
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
          */}
          <Accordion.Title active={activeIndex === 1} index={1} onClick={(e,p) => this.handleClick(e,p)} >
            <Icon color="red" size="huge" name="dropdown"/>
            <Icon name="info"/>
            Safety
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 1}>
            In support of safety, teammates:
            <ul>
              <li>From different households may connect via a video conferencing platform (Zoom, Discord, Skype, &hellip;).</li>
              <li>In the same physical space may follow the <a href="https://www.cdc.gov/coronavirus/2019-ncov/prevent-getting-sick/prevention.html">CDC recommendations</a>. Partial list:
                <ul>
                  <li>Avoid close contact&mdash;meet outdoors</li>
                  <li>Wash Hands</li>
                  <li>Cover mouth and nose with a mask</li>
                  <li>Cover coughs and sneezes</li>
                  <li>Clean and disinfect</li>
                </ul>
              </li>
            </ul>
          </Accordion.Content>
          <Accordion.Title active={activeIndex === 2} index={2} onClick={(e,p) => this.handleClick(e,p)} >
            <Icon color="red" size="huge" name="dropdown"/>
            <Icon name="info"/>
            What is the WWU Great Puzzle Hunt?
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 2}>
            The annual WWU Great Puzzle Hunt is a fun, full-day, team puzzle-solving event that is <strong>OPEN TO ALL!</strong>
            <ul>
              {/* virtualeventonly
              <li>Teams of up to 6 (recommended size 4-6) travel on foot about WWU campus (outdoors) solving a collection of puzzles involving logic, patterns, decoding, and a variety of skill sets.</li>
              <li><strong>Your mission</strong>: HAVE FUN! Reach the outdoor location shown on your smartphone and scan your team code (which starts clock) to receive a puzzle. You’ll need your wizard bag (scissors, tape, hole punch, etc.), as well as critical thinking, reasoning, and teamwork to MacGyver your way through. Once you solve the puzzle and enter the code word(s), the clock stops, and you are sent to the next destination. Connect all the code words to complete the game!</li>
              <li>The four main puzzles pertain to (1) Arts (Visual and Performing), (2) Sciences, (3) Humanities, and (4) the fourth puzzle is from a different academic discipline each year – past puzzle 4 topics included Paper Folding, Geometry, and Communication. Each person on the team is important and has special input to share. Choose a versatile team!</li>
              <li>Registered teams gain access to the Puzzle Hunt game platform (owned and built by WWU students) via smartphone.</li>
              <li>Prizes* are awarded in each division for best: times, costumes, and team names.</li>
              */}
              <li>Teams of up to 6 (recommended size 4-6) solve a collection of puzzles involving logic, patterns, decoding, and a variety of skill sets.</li>
              <li><b>Your mission</b>: HAVE FUN! Check in on morning of Hunt to download the info packet and puzzles. At START time, select the first puzzle to download it and start the team clock. You’ll need your wizard bag (scissors, tape, hole punch, etc.), as well as critical thinking, reasoning, and teamwork to MacGyver your way through. Once you solve the puzzle and enter the code word(s), the clock stops, and you may open the next puzzle. Connect all the code words to complete the game!</li>
              <li>The four main puzzles pertain to (1) Arts (Visual and Performing), (2) Sciences, (3) Humanities, and (4) the fourth puzzle is from a different academic discipline each year – past puzzle 4 topics included Paper Folding, Geometry, and Communication. Each person on the team is important and has special input to share. Choose a versatile team!</li>
              <li>Registered teams gain access to the Puzzle Hunt game platform (owned and built by WWU students) via smartphone or computer.</li>
              <li>Prizes are awarded to top three scoring teams in each division.</li>
              <li>Whether your team places first or two hundred and fifty-first, competing in the puzzle hunt is a great way to stretch your mental muscles, bond with your teammates, and have a lot of fun!</li>
            </ul>
            <strong>* </strong>{prizeNote}
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
            Don't Have a team?
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 17}>
              First create an account. View teams looking for members here: (<a href="#">TBA</a>)
          </Accordion.Content>
          <Accordion.Title active={activeIndex === 4} index={4} onClick={(e,p) => this.handleClick(e,p)} >
            <Icon color="yellow" name="dropdown"/>
            <Icon name="calendar"/>
            When is it? (Event Schedule)
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 4}>
            <h3>
              <strong>{eventDate}</strong> at 9:30 AM (PST)
            </h3>
            Other important dates:
            {importantDates}

            Schedule for the day:
            {schedule}
            <strong>* </strong>{wristbandNote}
            <br />
            <strong>** </strong>{prizeNote}
          </Accordion.Content>

          <Accordion.Title active={activeIndex === 5} index={5} onClick={(e,p) => this.handleClick(e,p)} >
            <Icon color="yellow" name="dropdown"/>
            <Icon name="user"/>
            Who is it for?
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 5}>
            <p>
              Students, Faculty, Staff, Alumni, Community, Family, Everyone, Anywhere!
            </p>
            {/* <strong>*</strong> Children under 14 must be accompanied at all times by a parent/legal guardian who must also be registered on the same team as the child. */}
            *Each participant under age 14 must have permission from a parent/legal guardian. The puzzles are created for ages 14 and older.
          </Accordion.Content>

          <Accordion.Title active={activeIndex === 6} index={6} onClick={(e,p) => this.handleClick(e,p)} >
            <Icon color="olive" name="dropdown"/>
            <Icon name="sitemap"/>
            What team divisions are there?
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 6}>
            <List className='bulleted'>
              <List.Item 
                header="WWU Students"
                description="All team members must be currently enrolled at WWU (undergrad or grad)."
              />
              <List.Item 
                header="Postsecondary Students"
                description="All team members must be currently enrolled in college (undergrad or grad), technical school, running start. Mix and match-team members from same or different schools."
              />
              <List.Item
                header="Secondary Students"
                description="All team members must be currently enrolled in middle school or high school. Exception: One adult chaperone per team may register as a team member."
              />
              <List.Item
                header="WWU Alumni"
                description="At least half of team members must be WWU Alumni"
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
              Awesome prizes will be awarded to top three teams in each division.
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
            <p>We know people are stretched in these times. We want to provide a safe, no cost, educational, fun activity accessible to all.</p>
            <p>This year, Registration is FREE. Donations are gratefully accepted and will help keep us afloat!</p>
          </Accordion.Content>

          <Accordion.Title active={activeIndex === 9} index={9} onClick={(e,p) => this.handleClick(e,p)} >
            <Icon color="green" name="dropdown"/>
            <Icon name="suitcase"/>
            What should I have on hand?
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 9}>
            Your creativity and problem solving skills! Along with the following:<br/>
            <List>
              <List.Item description="At least one smart phone. The more the better! (Think about battery life). Googling is encouraged!"/>
              <List.Item description="A clip board, or a note pad. Graph paper might come in handy."/>
              <List.Item description="Scissors and tape."/>
              <List.Item description="Writing utensils (pencils, erasers, highlighters)."/>
              <List.Item description="A felt tip marking pen - something that will mark a folded object, but not crush the object."/>
              <List.Item description="Standard 10-12 pack of colored pencils."/>
              <List.Item description="Water to drink and a sack lunch or snacks! Light refreshments will be provided."/>
              <List.Item description="Umbrella to stay dry!"/>
              <List.Item description="Hole punch for your puzzles." />
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

          {/* virtualeventonly
          <Accordion.Title active={activeIndex === 12} index={12} onClick={(e,p) => this.handleClick(e,p)} >
            <Icon color="teal" name="dropdown"/>
            <Icon name="food"/>
            Food?
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 12}>
            <p>
              Yes! To enter the free refreshments area, <strong>you must be wearing your wristband</strong> at all times.
              <br/>
              Wristbands are distributed at check-in.
            </p>
            <p>
              Coffee, tea, cocoa, and light refreshments will be available in front of Miller Hall (in Red Square) throughout the event while supplies last.
            </p>
            <List>
              <List.Item description="9:30 AM - Check in/receive wristband. Refreshments area opens along Miller Hall."/>
              <List.Item description="1:00 - 3:00 PM - Domino’s Pizza Arrives in Red Square"/>
            </List>
            <p>
              Special thanks to Market Street Catering of <a target="_blank" href="http://www.haggen.com/">Haggen NW Fresh</a> for providing fresh fruit and
              breakfast pastries including gluten free (GF) option, and fresh brewed coffee!
            </p>
          </Accordion.Content>
          */}

          {/* virtualeventonly
          <Accordion.Title active={activeIndex === 13} index={13} onClick={(e,p) => this.handleClick(e,p)} >
            <Icon color="blue" name="dropdown"/>
            <Icon name="rain"/>
            What if it rains?
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 13}>
            Welcome to Washington.  We hunt on!
          </Accordion.Content> 
          */}

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
            <p>This year you have several choices of puzzle hunt gear and hundreds of color combinations!</p>
            <p>Browse and buy our official gear below. All proceeds from these sales help support this event.</p>
            <List>
              <List.Item><a target="_blank" href="http://www.wwu.edu/emarket/puzzlehunt/#tshirts">Men's, Women's, Youth Cotton T-Shirts</a></List.Item>
              <List.Item><a target="_blank" href="http://www.wwu.edu/emarket/puzzlehunt/#50/50">Men's, Women's 50/50 Poly/Cotton Blend T-Shirts</a></List.Item>
              <List.Item><a target="_blank" href="http://www.wwu.edu/emarket/puzzlehunt/#Ltshirt">Men's, Women's Long Sleeve Cotton T-Shirts</a></List.Item>
              <List.Item><a target="_blank" href="http://www.wwu.edu/emarket/puzzlehunt/#csu">Unisex Crew Sweatshirts</a></List.Item>
              <List.Item><a target="_blank" href="http://www.wwu.edu/emarket/puzzlehunt/#sweatshirt">Unisex, Youth 50/50 Poly/Cotton Blend Hoodie Sweatshirts</a></List.Item>
              <List.Item><a target="_blank" href="http://www.wwu.edu/emarket/puzzlehunt/#zcs">Unisex Quarter-Zip Collar Sweatshirts</a></List.Item>
            </List>
            {gearPricing}
          </Accordion.Content>
          
        </Accordion>

        <br/>
        <p>Last Updated: January 2020</p>
      </Container>
    );
  }

  handleClick(e, titleProps) {
    console.log("handling click for: ", titleProps);
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
