import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { Container, Grid, Segment, Header, Icon, Image } from 'semantic-ui-react';
import LinkButton from '../../imports/LinkButton';
import GamestateComp from '../../imports/GamestateComp';

HomeDonate = class HomeDonate extends Component {
  render() {
    return (
      <Container className="section">
      <Segment basic>
      <section id="donate-message">

        <Grid centered textAlign="left" padded stackable>
          <Grid.Row verticalAlign='middle' width={14}>

            <Grid.Column width={8}>
              <Header as="h1" size="medium">
              Invest in Your Community by Sponsoring The Hunt!
              </Header>
              <Segment basic size='large' className="no-padding">
                <p>Donations of any amount will help support this event.</p>
                {/* <p>
                  Please Consider:<br/>
                </p>
                <ul>
                  <li><a href="mailto:&#109;&#105;&#108;&#108;&#105;&#101;&#064;&#119;&#119;&#117;&#046;&#101;&#100;&#117;">Sponsoring</a> a student or team that needs help to participate.</li>
                  <li>Non-monetary support such as <a href="mailto:&#109;&#105;&#108;&#108;&#105;&#101;&#064;&#119;&#119;&#117;&#046;&#101;&#100;&#117;">prizes</a> or <a href="/register">signing up</a> as a volunteer!</li>
                </ul> */}
                The WWU Great Puzzle Hunt operates under WWU Foundation's 501(c)(3) status, so all donations are tax deductible.
              </Segment>
              <LinkButton as='a'
                href="https://foundation.wwu.edu/greatpuzzlehunt"
                size='large'  content='Donate Online'
                icon={<Icon name='heart'/>}
                color="green"
              />
              <LinkButton as='a'
                href="https://foundation.wwu.edu/how-make-gift"
                size='large'  className="white button" content='Donating by check?'
                icon={<Icon name='heart'/>}
                color="green"
              />
            </Grid.Column>

            <Grid.Column width={8}>
              <Image fluid src='/img/2016/event-photos/gathering.jpg'/>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </section>
      </Segment>
      </Container>
    );
  }
}

HomeDonate = GamestateComp(HomeDonate);
