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

const AnnouncementsMessage = (
  <section id="announcements-message">
      <Grid padded stackable centered textAlign='left'>
        <Grid.Row>
          <Grid.Column width={16} className='raised'>
            <Container textAlign='left'>
              <Message color='orange' size='huge'>
                <Message.Content>
                  <Message.Header>
                    Announcements
                    </Message.Header>
                    <Segment basic size='large' className='no-padding' style={{lineHeight: "normal"}}>
                    <ul>
                      <li><strong>IMPORTANT</strong>: Game day is soon! Make sure at least one team member can obtain the <a target="_blank" href="https://gph-distributed.s3-us-west-2.amazonaws.com/GPH2021-what-you-need.pdf">necessary materials</a>.</li>
					  <li>Check-in starts at <strong>9:30 am Pacific Time.</strong> See <a target="_blank" href="https://www.timeanddate.com/worldclock/converter.html?iso=20210417T163000&p1=2447&p2=179&p3=136&p4=16&p5=240">other timezones.</a></li>
                      <li>The WWU Fifth Annual Great Puzzle Hunt is virtual, free, fun, and safe (See Safety <a href="/faq">FAQ</a>).</li>
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
