import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { Link } from 'react-router';
import { Container, Grid, Segment, Message } from 'semantic-ui-react';

const { regularRegistrationStart, eventDate, eventDay } = Meteor.settings.public;

import HomeHeader from './imports/HomeHeader';
import HomeIntro from './imports/HomeIntro';
import HomeEarlyBird from './imports/HomeEarlyBird';
import HomePastEvents from './imports/HomePastEvents';
import HomePeople from './imports/HomePeople';
import HomeDonate from './imports/HomeDonate';
import HomeSponsors from './imports/HomeSponsors';
import SamplePuzzles from './imports/SamplePuzzles';

const CoronavirusMessage = (
  <section id="coronavirus-message">
      <Grid padded stackable centered textAlign='left'>
        <Grid.Row>
          <Grid.Column width={16} className='raised'>
            <Container textAlign='left'>
              <Message color='blue' size='huge'>
                <Message.Content>
                  <Message.Header>
                    We Are Excited to Announce (Due to COVID-19 and Our Priority on Safety and Health):
                    </Message.Header>
                    <Segment basic size='large' className='no-padding' style={{lineHeight: "normal"}}>
                    <ul>
                      <li>The FIFTH Annual WWU Great Puzzle Hunt will be held <b>VIRTUALLY</b></li>
                      <li>On {eventDay}, {eventDate}</li>
                      <li>Registration and Gear Sales open {regularRegistrationStart}</li>
                      <li>The event is FREE (donations accepted) and open to all, anywhere in the world</li>
                      <li>Teammates need to be able to safely communicate with one another (See Safety <a style={{textDecoration: "underline"}} href="/faq">FAQ</a>)</li>
                    </ul>
                    <br/>
                   <center>Stay Healthy!</center>
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
          {CoronavirusMessage}

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
