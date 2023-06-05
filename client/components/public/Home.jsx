import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Container, Grid, List, Segment, Message } from 'semantic-ui-react';

const { regularRegistrationStart, eventDate, eventDay, gearSaleEnd } = Meteor.settings.public;

import HomeHeader from './imports/HomeHeader';
import HomeIntro from './imports/HomeIntro';
import HomeEarlyBird from './imports/HomeEarlyBird';
import HomePastEvents from './imports/HomePastEvents';
import HomePeople from './imports/HomePeople';
import HomeDonate from './imports/HomeDonate';
import HomeDonate0 from './imports/HomeDonate0';
import HomeSponsors from './imports/HomeSponsors';
import SamplePuzzles from './imports/SamplePuzzles';

const AnnouncementsMessage = (
  <section id="announcements-message">
      <Grid padded stackable centered textAlign='left'>
        <Grid.Row>
          <Grid.Column width={16} className='raised'>
            <Container textAlign='left'>
              <Message size='huge' warning>
                <Message.Content>
                  <Message.Header>
                    Thank you, Participants! Join us in 2024!
                  </Message.Header>
                  <Segment basic size='large' className='no-padding' style={{lineHeight: "normal"}}>
                    <List>
                      <List.Item>
                        The eigth annual Great Puzzle Hunt will take place
                        on <strong>Saturday, April 20th, 2024</strong>.
                        Mark your calendars!
                      </List.Item>

                      <List.Item>
                        There were a few minor scoring miscalculations on the Meta Puzzle in the
                        Open Division. Click to view
                        the <a href="https://gph-distributed.s3.us-west-2.amazonaws.com/2023/2023-gph-leaderboard_open-division.pdf">corrected
                              leaderboard</a>.
                      </List.Item>
                    </List>
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

          <HomeDonate0 />

          <HomeEarlyBird/>

          <HomeIntro/>

          <HomeDonate/>

          <a name='sponsors'/>

          <HomeSponsors/>

      </div>
    );
  }
}
