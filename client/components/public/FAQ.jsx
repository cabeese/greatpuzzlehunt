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
    <strong>Official Puzzle Gear Pricing</strong>
    <ul>
      <li>Early Bird Discount Price (varying styles: prices range from $10-20, additional $2 for extended sizes) until {earlyBirdLastDate}</li>
      <li>Regular Price (varying styles: prices range from $13-$23, additional $2 for extended sizes) begins {regularRegistrationStart} through {gearSaleEnd}</li>
      <li>Gear sale ends midnight {gearSaleEnd}</li>
      <li>The sale of these shirts helps to fund this event. Support the WWU Great Puzzle Hunt and wear our official Great Puzzle Hunt gear! Check out the styles, colors, and design. Pick up your shirts at event check-in.</li>
    </ul>
  </span>
);

const importantDates = (
  <List className='bulleted'>
    <List.Item><strong>{earlyBirdLastDate}</strong>: Early Bird discount prices for ticket codes and official gear end.</List.Item>
    <List.Item><strong>{gearSaleEnd}</strong>: Official Puzzle Hunt Gear Pre-Order deadline (pick up your gear at check-in on {eventDate})</List.Item>
    <List.Item><strong>{registrationCloseDate}</strong>: Step 1 of Registration Closes (Or earlier if team limit is reached). <br/>If you've already created an account you can purchase and redeem a ticket codes up until {eventDate} at 10:00 AM.</List.Item>
  </List>
);

const schedule_data = [
  {
    time: "9:30 - 10:15 AM",
    desc: "Red Square Check-in: Information packet, wristband*, swag bag, pre-ordered shirts. Photos for team costume competition. Rolls, coffee, cocoa, tea, fresh fruit. Free to registered participants. Thank you, Haggen & Woods!",
  },
  {
    time: "10:15 AM",
    desc: "Red Square: Announcements."
  },
  {
    time: "10:30 AM",
    desc: "Red Square: Puzzle Hunt starts!"
  },
  {
    time: "1:00 - 3:00 PM",
    desc: "Red Square: KUGS Radio plays music. Domino's pizza. Grab a slice or 2, cookies, & beverage between puzzles. Free to registered participants."
  },
  {
    time: "4:25 PM",
    desc: "Puzzle Stations close. Finish Puzzles and return to Red Square."
  },
  {
    time: "4:30 - 5:00 PM",
    desc: "Red Square: Award Ceremony & Prizes**!"
  },
]

const schedule = (
  <List>
    {schedule_data.map((item, idx) => (
      <List.Item header={item.time} description={item.desc} key={idx}/>
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

          <Accordion.Title active={activeIndex === 1} index={1} onClick={(e,p) => this.handleClick(e,p)} >
            <Icon color="red" size="huge" name="dropdown"/>
            <Icon name="map"/>
            Directions & Parking
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 1}>
            <p>
              Parking is FREE in all C-Lots on south campus on weekends.
            </p>
            <p>
            Go to Red Square in the middle of campus for: Check-in, food, coffee (courtesy of Haggen NW Fresh and Woods Coffee), and Awards Ceremony.
            </p>
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

          <Accordion.Title active={activeIndex === 2} index={2} onClick={(e,p) => this.handleClick(e,p)} >
            <Icon color="orange" size="huge" name="dropdown"/>
            <Icon name="info"/>
            What is the WWU Great Puzzle Hunt?
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 2}>
            <p>
              The WWU Great Puzzle Hunt is an outdoor adventure - think scavenger hunt, but with puzzle-solving.
              Teams of up to 6 (recommended size 4-6) travel on foot about WWU campus (outdoors) solving
              a collection of puzzles (involving logic, patterns, decoding, and a variety
              of skill sets). Lots of prizes* will be awarded. Whether your team places
              first or two hundred and fifty-first, competing in the puzzle hunt is a
              great way to stretch your mental muscles, bond with your teammates,
              and have a lot of fun!
            </p>
            <p>
              Registered teams are assigned a QR code and connected to our game
              platform on their smartphone(s). Your mission: Reach each
              puzzle location and scan your QR code to receive the puzzle and start the clock!
            </p>
            <p>
              Don’t forget your bag of scissors, tape, hole punch, etc. to
              MacGyver your way through. Once you determine and enter code word(s),
              the clock stops and you are sent to the next destination. Connect
              all the code words to complete the game! <strong>OPEN TO ALL!</strong>
            </p>
            <strong>* </strong>{prizeNote}
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

          <Accordion.Title active={activeIndex === 4} index={4} onClick={(e,p) => this.handleClick(e,p)} >
            <Icon color="yellow" name="dropdown"/>
            <Icon name="calendar"/>
            When is it?
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 4}>
            <h3>
              <strong>{eventDate}</strong> at 9:30 AM, Red Square, WWU
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
              Students, Faculty, Staff, Alumni, Community, Everyone!
            </p>
            <strong>*</strong> Children under 14 must be accompanied at all times by a parent/legal guardian who must also be registered on the same team as the child.
          </Accordion.Content>

          <Accordion.Title active={activeIndex === 6} index={6} onClick={(e,p) => this.handleClick(e,p)} >
            <Icon color="olive" name="dropdown"/>
            <Icon name="sitemap"/>
            What team divisions are there?
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 6}>
            <Header as="h2">Competitive*</Header>
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
            </List>
            <p>
              <small>
                <strong>*Note:</strong> A minimum of 10 teams are required to form a division; else the teams in that division may merge with another division.<br/>
              </small>
            </p>

            <Header as="h2">Non-competitive</Header>
            All teams who enjoy puzzling without time pressure.
            <br /><br />
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
              Awesome prizes* will be awarded to top three teams in each division. Other prizes* for best team names, costumes, and more!
            </p>
            <strong>* </strong>{prizeNote}
          </Accordion.Content>

          <Accordion.Title active={activeIndex === 8} index={8} onClick={(e,p) => this.handleClick(e,p)} >
            <Icon color="green" name="dropdown"/>
            <Icon name="dollar"/>
            How much does this cost?
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 8}>
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
          </Accordion.Content>

          <Accordion.Title active={activeIndex === 9} index={9} onClick={(e,p) => this.handleClick(e,p)} >
            <Icon color="green" name="dropdown"/>
            <Icon name="suitcase"/>
            What should I bring?
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
              <List.Item description="Umbrella for your puzzles!"/>
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

          <Accordion.Title active={activeIndex === 11} index={11} onClick={(e,p) => this.handleClick(e,p)} >
            <Icon color="teal" name="dropdown"/>
            <Icon name="clock"/>
            How long will this last? (Event Schedule)
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 11}>
            {schedule}
            <strong>* </strong>{wristbandNote}
            <br />
            <strong>** </strong>{prizeNote}
          </Accordion.Content>

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
              breakfast pastries including gluten free (GF) option and <a target="_blank" href="https://woodscoffee.com/">Woods Coffee</a> for the fresh brewed coffee!
            </p>
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
            <Icon color="violet" name="dropdown"/>
            <Icon name="shop"/>
            What does the Gear/Apparel look like?
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 15}>
            <p>This year you have several choices of puzzle hunt gear and hundreds of color combinations!</p>
            <p>Note: to buy gear you will be redirected to <a target="_blank" href="https://commerce.cashnet.com/TheGreatPuzzleHunt2019">this CashNet page</a> where you need to click the bottom gear link to select your gear options.</p>
            <List>
              <List.Item><a target="_blank" href="http://www.wwu.edu/emarket/puzzlehunt/#tshirts">Mens Cotton T-Shirts</a></List.Item>
              <List.Item><a target="_blank" href="http://www.wwu.edu/emarket/puzzlehunt/#wtshirts">Womens Cotton T-Shirts</a></List.Item>
              <List.Item><a target="_blank" href="http://www.wwu.edu/emarket/puzzlehunt/#ktshirts">Youth Cotton Blend T-Shirts</a></List.Item>
              <List.Item><a target="_blank" href="http://www.wwu.edu/emarket/puzzlehunt/#50/50">Mens & Womens 50/50 Poly/Cotton Blend T-Shirts</a></List.Item>
              <List.Item><a target="_blank" href="http://www.wwu.edu/emarket/puzzlehunt/#Ltshirt">Mens & Womens Long Sleeve Cotton T-Shirts</a></List.Item>
              <List.Item><a target="_blank" href="http://www.wwu.edu/emarket/puzzlehunt/#sweatshirt">Unisex 50/50 Poly/Cotton Blend Sweatshirts</a></List.Item>
              <List.Item><a target="_blank" href="http://www.wwu.edu/emarket/puzzlehunt/#ksweatshirt">Youth Unisex 50/50 Poly/Cotton Blend Sweatshirts</a></List.Item>
            </List>
            {gearPricing}
          </Accordion.Content>
        </Accordion>

        <br/>
        <p>Last Updated: January 2019</p>
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
