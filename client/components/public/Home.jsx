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
              <Message size='huge'>
                <Message.Content>
                  <Message.Header>
                    Thank you!
                  </Message.Header>
                  <Segment basic size='large' className='no-padding' style={{lineHeight: "normal"}}>
                    <List>
                      <List.Item>
                        <List.Icon name="cart" />
                        <List.Content>
                          Assuming no supply chain delays, <strong>shirts</strong> should be shipped out or ready for pick-up the week of April 25.
                        </List.Content>
                      </List.Item>
                      <List.Item>
                        <List.Icon name="puzzle" />
                        <List.Content>
                          <strong>Puzzles, hints, and walk-throughs</strong> are posted on
                          the <a style={{'text-decoration': 'underline'}} href="/puzzles">puzzles</a> page.
                        </List.Content>
                      </List.Item>
                      <List.Item>
                        <List.Icon name="trophy" />
                        <List.Content>
                          <strong>Leaderboards</strong> are available by division here:
                          <br />
                          <List horizontal celled size="large">
                            <List.Item>
                              <a target="_blank" href="https://gph-distributed.s3.us-west-2.amazonaws.com/2022/leaderboards/2022-GPH-Leaderboard_RevB_Students.pdf">
                                WWU Students
                              </a>
                            </List.Item>
                            <List.Item>
                              <a target="_blank" href="https://gph-distributed.s3.us-west-2.amazonaws.com/2022/leaderboards/2022-GPH-Leaderboard_RevB_Alumni.pdf">
                                WWU Alumni
                              </a>
                            </List.Item>
                            <List.Item>
                              <a target="_blank" href="https://gph-distributed.s3.us-west-2.amazonaws.com/2022/leaderboards/2022-GPH-Leaderboard_RevB_Secondary.pdf">
                                Secondary Students
                              </a>
                            </List.Item>
                            <List.Item>
                              <a target="_blank" href="https://gph-distributed.s3.us-west-2.amazonaws.com/2022/leaderboards/2022-GPH-Leaderboard_RevA_Open.pdf">
                                Open
                              </a>
                            </List.Item>
                          </List>
                          <br />
                          <small>Thank you for your patience as we try to compensate for lag in the system.
                          If you think your team experienced a scoring miscalculation, please email us
                          at <a href="mailto:support@greatpuzzlehunt.com">support@greatpuzzlehunt.com</a>.</small>
                        </List.Content>
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
