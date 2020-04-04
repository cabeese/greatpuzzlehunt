import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { Link } from 'react-router';
import { Container, Grid, Segment, Message } from 'semantic-ui-react';

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
                    Due to COVID-19 and Our Priority on Safety and Health:
                  </Message.Header>

                  <Segment basic size='large' className="no-padding"
                    style={{lineHeight: "normal"}}>
                    It is with deep regret that we are
                    <strong> postponing the FIFTH Annual WWU Great Puzzle Hunt </strong>
                    until next year.
                    Tentative date: Saturday, April 17, 2021.

                    <br /><br />

                    All ticket/shirt purchases will be refunded to credit card of purchaser. You will be notified via the email you used for the transaction.
                    <br /><br />
                    <center>Stay Healthy!</center>
                  </Segment>
                  </Message.Content>
                </Message>
                <br />
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
