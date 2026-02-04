import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Grid,
  Icon,
  Image,
  List,
} from 'semantic-ui-react';
import LinkButton from '../../imports/LinkButton';
import GamestateComp from '../../imports/GamestateComp';
const {
  eventDate,
  eventYear,
  gearSaleEnd,
  registrationCloseDate,
  registrationOpenDate,
  regularRegistrationStart,
} = Meteor.settings.public;

// Strip spaces and other odd characters out to make a URL-friendly
// string for a given section name.
export function getAnchorName(name) {
  return name.replaceAll(" ", "-").toLowerCase();
}

export const puzzle_schedule_inPerson_data = [
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
    time: "12:30–2:30 PM",
    desc: "Red Square: Music. Pizza. Grab a slice or 2, cookies, & beverage between puzzles. Free to registered participants. Thank you, Domino's Pizza!"
  },
  {
    time: "3:00 PM",
    desc: "Food/Beverage Station closes.",
  },
  {
    time: "4:30 PM",
    desc: "Puzzle Stations close."
  },
  {
    time: "4:45 PM",
    desc: "Red Square: Award Ceremony & Prizes!**"
  },
];

export const puzzle_schedule_virtual_data = [
  {
    time: "9:30–10:15 AM (PT)",
    desc: "Check-in: Download and open information packet."
  },
  {
    time: "10:15 AM (PT)",
    desc: "Live Stream Announcements"
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
    time: "4:45 PM (PT)",
    desc: "Leaderboard Posted, Live stream - claim your bragging rights!"
  },
];

export const importantDates = (
  <List className='bulleted'>
    <List.Item><strong>{registrationCloseDate}</strong>: Step 1 of Registration (Create an Account) Closes - Or earlier if team limit is reached</List.Item>
    <List.Item><strong>{eventDate}</strong>: If you've already created an account, you can join a team until 10:00 AM (PT).</List.Item>
    <List.Item><strong>{gearSaleEnd}</strong>: Official Gear store closes at midnight.</List.Item>
  </List>
);

export class Parking extends Component {
  render() {
    return (
      <div>
        <p>
          <strong>Parking is FREE in the C-Lots on south campus on weekends.</strong>
        </p>

        <p>
          <small>On weekdays, C lots are free after 4:30 pm (Monday, April 20, 2026 is a weekday)</small>
        </p>

        <Button as="a"
                basic color='blue' size='small'
                href="http://www.wwu.edu/map/" target="_blank">
          Interactive Campus Map
        </Button>
      </div>
    );
  }
}

export const matchmakingInfo = (
  <div>
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
      setting for a team you're interested in joining, as well as if
      they're playing the "Puzzle Hunt" and/or the "Treasure Hunt." If
      that team is planning to play a different game or from a
      different location than you, this could be a problem!
    </p>

    <Button as="a"
            basic color='blue' size='small'
            href={"teams-list"}>
      Explore Teams
    </Button>
  </div>
);

export class Directions extends Component {
  render() {
    return (
      <div>
        <h2>Directions from the South</h2>
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

        <h2>Directions from the North</h2>
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
      </div>
    );
  }
}

const gearPricing = (
  <span>
    <strong>Official Puzzle Gear Pricing</strong>
    <ul>
      <li>Prices on varying styles range from $20&ndash;$40, additional charges for extended sizes. Gear store opens {registrationOpenDate}&ndash;{gearSaleEnd}.</li>
      <li>Gear sales end midnight {gearSaleEnd}.</li>
      <li>Shirts will be ordered on Monday, April 20 and assuming no supply chain delays, should be shipped out or ready for pick-up by the end of the week of May 4, 2026.</li>
      <li>The sale of these shirts helps fund this event. Support the WWU Great Puzzle Hunt and wear our official Great Puzzle Hunt gear! Check out the styles, colors, and design.</li>
    </ul>
    <p> If you are able, please consider making a small donation (suggested $5 students, $10 nonstudents) and/or buying a shirt (our only fund raiser). Donations of any amount will help sustain this event. </p>
  </span>
);

class AboutGearComp extends Component {
  _exploreGear() {
    return (
        <Button as="a"
                basic color='blue' size='small'
                href={"/gear"}>
          Explore Gear
        </Button>
    )
  }
  _gearClosedMessage() {
    return (
      <p>The Great Puzzle Hunt Gear store is currently closed. Opens {registrationOpenDate}.</p>
    )
  }

  render() {
    const { ready } = this.props;
    const gamestate = this.props.gamestate || {};

    const givingURL = gamestate && gamestate.givingURL ? gamestate.givingURL : "https://foundation.wwu.edu/greatpuzzlehunt";
    const buyGear = gamestate && gamestate.buyGear;

    if (!ready) {
      return (
        <span>Gear details loading...</span>
      );
    }

    return (
      <Grid stackable>
        <Grid.Row>
          <Grid.Column width={10}>
            <p>There are 13 style choices, wonderful colors, and an awesome design!</p>
            { buyGear ? this._exploreGear() : this._gearClosedMessage() }
            <br /><br />
            {gearPricing}
	    <LinkButton as='a'
			href={givingURL}
			size='large'  content='Donate Online'
			icon={<Icon name='heart'/>}
			color="green"
	    />
	    { buyGear ?	    
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
    );
  }
}
AboutGearComp.propTypes = {
  ready: PropTypes.bool.isRequired,
  gamestate: PropTypes.object,
}
export const AboutGear = GamestateComp(AboutGearComp);

class SupportComp extends Component {
  render() {
    const { ready } = this.props;
    const gamestate = this.props.gamestate || {};
    const buyGear = gamestate && gamestate.buyGear;
    const givingURL = gamestate && gamestate.givingURL ?
          gamestate.givingURL : "https://foundation.wwu.edu/greatpuzzlehunt";

    return (
      <React.Fragment>
        <p> We keep this event free to you thanks to generous donations from our sponsors, and from gear purchases. These contributions help cover costs of this event including web fees and development, graphics, prizes, advertising, and much more. </p>
        <p>You can help out by:</p>
        <ul>
          <li> Donating any amount. $5 and $10 donations make a difference. </li>
          <li> Purchasing a shirt!</li>
	  <li> Volunteering!* It takes a team to make the Puzzle Hunt happen, and we are grateful for everyone who helps out.</li>
	</ul>
        <p> The WWU Great Puzzle Hunt operates under WWU Foundation's 501(c)(3) status, so all donations are tax deductible. </p>
        <p> <strong>*</strong> Volunteers choose the "volunteer" account type when <a href="/register">registering</a>. Questions? Contact <a href="mailto:info@greatpuzzlehunt.com">info@greatpuzzlehunt.com</a>. </p>
        <LinkButton as='a'
		    href={givingURL}
		    size='large'  content='Donate Online'
		    icon={<Icon name='heart'/>}
		    color="green"
        />
        { buyGear ?	    
          <LinkButton as='a' href="/gear"
		      size="large" color="orange" target="_blank"
		      icon={<Icon name="shopping cart" />}
		      content="Buy Gear"
          />
	  : "" }
      </React.Fragment>
    )
  }
}
SupportComp.propTypes = {
  ready: PropTypes.bool.isRequired,
  gamestate: PropTypes.object,
}
export const Support = GamestateComp(SupportComp);
