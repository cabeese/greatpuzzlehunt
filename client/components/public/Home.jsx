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
                    Join us in 2023!
                  </Message.Header>
                  <Segment basic size='large' className='no-padding' style={{lineHeight: "normal"}}>
                    <List>
                      <List.Item>
                        The seventh annual Great Puzzle Hunt will take place
                        on <strong>Saturday, April 15th, 2023</strong>.
                      </List.Item>

                      <List.Item>
                        Registration is FREE and open to all, anywhere in the world.
                        Donations are gratefully accepted.
                      </List.Item>

                      <List.Item>
                        The event is <em>hybrid</em>: teams may play in person or virtually.
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

          <HomeEarlyBird/>

          <HomeIntro/>

          <HomeDonate/>

          <a name='sponsors'/>

          <HomeSponsors/>

      </div>
    );
  }
}
