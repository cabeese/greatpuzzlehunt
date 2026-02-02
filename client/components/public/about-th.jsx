import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import LinkButton from '../imports/LinkButton';
import {
  Button,
  Container,
  Divider,
  Grid,
  Header,
  Image,
  ImageGroup,
  List,
  ListList,
  Message,
  Segment,
} from 'semantic-ui-react';
import {
  getAnchorName,
  matchmakingInfo,
  Parking,
  Directions,
  AboutGear,
  Support,
} from './imports/common-details';

class AboutTh extends Component {
  // ==================================================================
  // ==================== Section Body Definitions ====================
  // ==================================================================
  _gameDetails() {
    return (
      <div>
        <p>
          The Treasure Hunt is IN-PERSON, only. Register (FREE) to gain access to the <strong>Official Treasure Hunt Map and Secret Starting Location</strong> and <strong>QR codes at check-point stations that contain clues and/or directions.</strong> (See <a href="#schedule">schedule</a> section)
        </p>

        <p>
          <strong>The Treasure Hunt is not timed, but it ends at 8:00 PM, Monday, April 20, 2026.</strong>
        </p>
        <p>
          Enjoy a fun, outdoor adventure, requiring walking at least 1 mile around WWU campus on varied terrain (grass & gravel paths, paved walkways) using compass and map orienteering (see <a href="#tools">tools</a> section). Collect clues & respond to questions at checkpoints with the ultimate goal to collect a memento from the treasure chest hidden somewhere on campus!
        </p>

        <p>
          <strong>Goal: HAVE FUN!</strong> Find the hidden treasure chest on WWU campus. Don’t ruin the game for others. Try to be inconspicuous with your findings.
        </p>

        <p>
          <strong>Look for:</strong> painted rocks hidden about campus that contain information to collect in your logbook (see <a href="#tools">tools</a> section) and clues leading to the “next location.” The “next location” will be another marked rock or a light pole, sculpture, or other campus landmark that might have a Treasure Hunt logo and/or a QR code affixed.
        </p>

        <p>
          <strong>Sample rocks</strong> Top: orange avatar; Under side: directions; Perhaps letters on either side.
        </p>

        <p>
          <strong>
            Remember to return rock to original location with orange avatar side up.
          </strong>
        </p>

        <ImageGroup size='large'>
          <Image src='https://gph-distributed.s3.us-west-2.amazonaws.com/img/static/th-rock-01a-bottom+directions-letters.jpg' />
          <Image src='https://gph-distributed.s3.us-west-2.amazonaws.com/img/static/th-rock-01b-top-avatar-letters.jpg' />
          <Image src='https://gph-distributed.s3.us-west-2.amazonaws.com/img/static/th-rock-02a-bottom.jpg' />
          <Image src='https://gph-distributed.s3.us-west-2.amazonaws.com/img/static/th-rock-02b-top.jpg' />
        </ImageGroup>

        <h2>Please, leave no traces</h2>

        <p>
          Do not alter the environment, i.e., don't damage natural or manmade objects in your search and leave area as you found it. You may look under a branch but do not remove a branch. You may look behind a boulder or in a planter or in a tree stump, but do not move the boulder, dig in the dirt, or harm the stump.
        </p>

        <p>
          <strong>Try to be inconspicuous</strong> - avoid drawing attention to the clues or the treasure/cache. Don't ruin the game for others.
        </p>

        <p>
          <strong>Distance directions</strong> will be given in metric units and compass directions in degrees from True North (not Magnetic North).  iPhones have a good built-in compass app. A good, free compass app for Androids is Digital Compass from Axiomatic Inc. 
        </p>

        <Image src='https://gph-distributed.s3.us-west-2.amazonaws.com/img/static/treasure-chest-02.jpg'
               size='medium' floated='right' />

        <p>
          Keep the map and compass handy, mark your finds on the map and keep a notebook to log information as you travel (see <a href="#tools">tools</a> section). <strong>You may need to enter information in a particular order at QR checkpoints</strong>, where your team will scan, sign in, and answer a question to receive information to the next clue.
        </p>

        <p>
          You may need to connect all the information in some way to respond to the question on the last QR code to get the final destination of the TREASURE CHEST, where you may collect a trinket, one for each team member, please.
        </p>

        <h2>Who is it for?</h2>
        <List bulleted>
          <List.Item>
            Students, Faculty, Staff, Alumni, Community, Friends, Family, anyone who enjoys an outdoor adventure.
          </List.Item>
          <List.Item>Each team with participant(s) under age 14 must include at least one registered adult team member to accompany minor(s) at all times.</List.Item>
          <List.Item>Participants under 18 who are not enrolled WWU students: A parent/legal guardian must complete the registration form on behalf of their minor.</List.Item>
        </List>

        <h2>What if it rains?</h2>
        <p>
          Welcome to Washington.  We hunt on!
        </p>
      </div>
    );
  }

  _etiquette() {
    return (
      <div>
        <p>
          <strong>Leave no traces</strong> - do not alter the environment, i.e., don't damage natural or man-made objects in your search and leave area as you found it. 
        </p>

        <List>
          <List.Item>You may look under a branch but do not remove a branch.</List.Item>
          <List.Item>
            You may look behind a boulder or in a planter or in a tree stump, but do not move the boulder, dig in the dirt, or harm the stump.
          </List.Item>
        </List>

        <p>
          <strong>Try to be inconspicuous</strong> - avoid drawing attention to the clues or the treasure/cache. Don't ruin the game for others.
        </p>
      </div>
    );
  }

  _secretStartingPlaceAndMap() {
    return (
      <div>
        <p>
          <strong>
            Only registered players may gain access to the Official Treasure Hunt Map and Secret Starting Location and QR codes at check-point stations that contain clues.
          </strong>
        </p>

        <p>
          Access the Official Treasure Hunt Map and Secret Starting Location  starting at 7:00 am on April 19, 2026.
        </p>

        <List bulleted>
          <List.Item>
            The Treasure Hunt is not timed, but it ends at 8:00 PM, Monday, April 20, 2026. 
          </List.Item>
          <List.Item>
            The Treasure Hunt is open April 19, 2026, 7:00 AM to April 20, 2026, 8:00 PM. However, Great Puzzle Hunt finishers gain early access to the Treasure Hunt on April 18, 2026. 
          </List.Item>
          <List.Item>
            Registered Great Puzzle Hunt & Treasure Hunt Players will be offered a link to the Official Treasure Hunt Map and Secret Starting Location, upon completion of the Meta-Puzzle. 
          </List.Item>
          <List.Item>
            Registered Great Puzzle Hunt & Treasure Hunt Players who do not complete the MetaPuzzle can access the Official Treasure Hunt Map and Secret Starting Location starting at 7:00 am on April 19, 2026.
          </List.Item>
        </List>
      </div>
    );
  }

  _teams() {
    return (
      <div>
        <p>
          A maximum of 6 people are allowed on a team.
        </p>

        {matchmakingInfo}
      </div>
    );
  }

  _tools() {
    return (
      <div>
        <List bulleted>
          <List.Item>
            <strong>Official Treasure Hunt Map</strong> (see above)
          </List.Item>
          <List.Item>
            <strong>Secret starting location</strong> (see above)
          </List.Item>
          <List.Item>
            <strong>Compass App</strong> or actual compass set to True North (not magnetic North)
            <ListList>
              <List.Item>
                Distance directions will be given in metric units and compass directions in degrees from True North (not Magnetic North).
              </List.Item>
              <List.Item>
                iPhones have a good built-in compass app. A good, free compass app for Androids is Digital Compass from Axiomatic Inc.
              </List.Item>
            </ListList>
          </List.Item>
          <List.Item>
            <strong>Notepad</strong> (logbook) & pen/pencil to log clues on the trail
          </List.Item>
          <List.Item>
            <strong>Smart phone (or laptop)</strong> to search for information, scan QR codes at check-in stations, and enter and receive information on the Treasure Hunt game platform
          </List.Item>
        </List>
      </div>
    );
  }

  _prizes() {
    return (
      <div>
        <p>
          Once you find the final <strong>TREASURE CHEST</strong>, you may collect a trinket (one for each team member, please).
        </p>
      </div>
    );
  }

  _register() {
    return (
      <div>
        <p>
          <strong>REGISTRATION CLOSES MONDAY, APRIL 20, 2026 at 7:45 PM</strong>
        </p>

        <p>
          Registration is FREE and open to all. Donations are gratefully accepted.
        </p>

        <p>
          Participants under age 14 must include at least one registered adult team member to accompany minor(s) at all times.
        </p>

        <p>
          Registration is required for all participants in 
          either or both events for safety, liability, and emergency purposes.
        </p>

        <p>
          Only registered players may gain access to the Official Treasure Hunt Map and Secret Starting Location and QR codes at check-point stations that contain clues.
        </p>

        <Button as="a"
                basic color='blue' size='small'
                href={"/register"}>
          Register
        </Button>
      </div>
    );
  }

  _schedule() {
    return (
      <div>
        <p>
          <strong>
            April 19, 2026 at 7:00 AM - April 20, 2026 at 8:00 PM
          </strong>
        </p>

        <p>
          Event Starts. Registered Treasure Hunt players can access the Official Treasure Hunt Map and Secret Starting Locations.
        </p>

        <p>
          The Treasure Hunt is not timed, but it ends at 8:00 PM, Monday, April 20, 2026
        </p>

        <Divider />

        <p>
          Only registered players may gain access to the <strong>Official Treasure Hunt Map and Secret Starting Location</strong> and <strong>QR codes at check-point stations</strong> that contain clues. These will be available through the "Treasure Hunt Gameplay" section of the site when players gain access.
        </p>

        <p>
          However, <u>Great Puzzle Hunt</u> finishers gain early access to the Treasure Hunt on April 18, 2026 after completing the meta puzzle. 
        </p>

        <p>
          Registered Great Puzzle Hunt & Treasure Hunt Players who <strong>do not complete the MetaPuzzle</strong> can access the Official Treasure Hunt Map and Secret Starting Location here starting at 7:00 am on April 19, 2026.
        </p>
      </div>
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
    "Register": this._register(),
    "Schedule": this._schedule(),
    "Secret Starting Place and Map": this._secretStartingPlaceAndMap(),
    "Tools": this._tools(),
    "Teams": this._teams(),
    "Etiquette": this._etiquette(),
    "Prizes": this._prizes(),
    "Parking": <Parking />,
    "Directions": <Directions />,
    "Gear": <AboutGear />,
    "Support": <Support />,
  }

  render() {
    return (
      <Container>
        {/* Page title */}
        <Header as="h1" size="medium">
          The GPH Treasure Hunt
        </Header>
        <Header as="h2">
          Brought to you by the WWU Great Puzzle Hunt
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

export default AboutTh;
