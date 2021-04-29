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
              <Message color='blue' size='huge'>
                <Message.Content>
                  <Message.Header>
                    Thank you for participating!
                    </Message.Header>
                    <Segment basic size='large' className='no-padding' style={{lineHeight: "normal"}}>
                      Thank you so much to everyone who participated this year!
                      We hope that you had fun in spite of some growing pains on our end.
                      We love this event and nothing is more important than making it fun for everyone!
                      <ul>
                        <li>All 2021 materials (puzzles, hints, solutions, and walkthroughs) are now posted
                          on the <u><Link to="/puzzles">Puzzles</Link></u> page!</li>
                        <li>
                          The <u><Link to="/leaderboard">leaderboard</Link></u> is now public.
                          All prize winners will receive an email from us soon. We will need to verify your name,
                          email address, and (in some cases) mailing address.
                          You MUST respond within 24 hours or the prizes will go to the next place team.
                        </li>
                      </ul>
                      In our ever-continuing quest for a day devoted to thinking, learning, puzzling, and having fun,
                      we will march forward based on the survey results and, as always, we will work on improving.
                      <br/>
                     <center>Thank you to everyone!</center>
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
