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
                    Thank you!
                  </Message.Header>
                    <Segment basic size='large' className='no-padding' style={{lineHeight: "normal"}}>
                      <ul>
                        <li>Thank you to everyone who participated in the 2022 hunt!</li>
                        <li>Puzzles, hints, and walk-throughs are posted on the <a style={{'text-decoration': 'underline'}} href="/puzzles">puzzles</a> page.</li>
                        <li>Leaderboard will be fixed and posted soon.</li>
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
