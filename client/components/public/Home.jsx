import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Container, Grid, Segment, Message } from 'semantic-ui-react';

const { regularRegistrationStart, eventDate, eventDay, gearSaleEnd } = Meteor.settings.public;

import HomeHeader from './imports/HomeHeader';
import HomeIntro from './imports/HomeIntro';
import HomeEarlyBird from './imports/HomeEarlyBird';
import HomePastEvents from './imports/HomePastEvents';
import HomePeople from './imports/HomePeople';
import HomeDonate from './imports/HomeDonate';
import HomeSponsors from './imports/HomeSponsors';
import SamplePuzzles from './imports/SamplePuzzles';

const AnnouncementsMessage = (
  <section id="announcements-message">
      <Grid padded stackable centered textAlign='left'>
        <Grid.Row>
          <Grid.Column width={16} className='raised'>
            <Container textAlign='left'>
              <Message color='blue' size='huge'>
                <Message.Content>
                  <Message.Header>
                    We Are Excited to Announce the SIXTH Annual Great Puzzle Hunt
                    </Message.Header>
                    <Segment basic size='large' className='no-padding' style={{lineHeight: "normal"}}>
                      <ul>
                        <li>Date: { eventDay }, { eventDate } from 9:30 AM&mdash;5:00 PM (PT).</li>
                        <li>Event is FREE and open to all (donations gratefully accepted).</li>
                        <li>The event is HYBRID this year with In-Person (WWU campus community OR by permission*) and Virtual options.</li>
                        <ul>
                          <li>* If some or all your team members are not WWU Community (<a style={{"text-decoration": "underline"}} href="https://www.wwu.edu">wwu.edu</a> email addresses) but your team would like to play “in-person,” please contact <a style={{"text-decoration": "underline"}} href="mailto:millie@greatpuzzlehunt.com">millie@greatpuzzlehunt.com</a> asap. In the interest of safety, each non-WWU team member will need to verify vaccination status and agree to mask when indoors.</li>
                        </ul>
                      </ul>
                      <ul>
                        <li>Gear store closes { gearSaleEnd }.</li>
                        <li>Shirts will be ordered on Monday, April 11 and assuming no supply chain delays, should be shipped out or ready for pick-up the week of April 18.</li>
                      </ul>
                      <br />
                      <center><strong>Check back here for updates!</strong></center>
                    </Segment>
                  </Message.Content>
                </Message>
            </Container>
          </Grid.Column>
        </Grid.Row>
      </Grid>

  </section>
)

Home = class Home extends Component {
  render() {
    return (
      <div>
          {AnnouncementsMessage}

          <HomeHeader/>

          <HomeEarlyBird/>

          <HomeIntro/>

          <HomeDonate/>

          <a name='sponsors'/>

          <HomeSponsors/>

      </div>
    );
  }
}
