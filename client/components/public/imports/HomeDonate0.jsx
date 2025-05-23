import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { Container, Grid, Segment, Header, Icon, Image } from 'semantic-ui-react';
import LinkButton from '../../imports/LinkButton';
import GamestateComp from '../../imports/GamestateComp';

const { eventYear } = Meteor.settings.public;

HomeDonate0 = class HomeDonate0 extends Component {
  render() {
    const gamestate = this.props.gamestate || {};
    const givingURL = gamestate && gamestate.givingURL ? gamestate.givingURL : "https://foundation.wwu.edu/greatpuzzlehunt";
    return (
      <Container className="section">
      <Segment basic>
      <section id="donate-message-0">

        <Grid centered textAlign="left" padded stackable>
          <Grid.Row verticalAlign='middle' width={14}>

            <Grid.Column width={8}>
              <Header as="h1" size="medium">
                Help keep us afloat!
              </Header>
              <Segment basic size='large' className="no-padding">
                <p>One of our goals is to keep the WWU Great
                   Puzzle Hunt FREE so that EVERYONE can participate.
                   To do that, we depend on donations from those who
                   can afford them. If you are able, please consider
                   making a small donation (suggested $5 students,
                   $10 nonstudents) and/or buying a shirt (our only fund
                   raiser).</p>
                <p>Donations of any amount will help support this event.</p>
              </Segment>
              <LinkButton as='a'
                href={givingURL}
                size='large'  content='Donate Online'
                icon={<Icon name='heart'/>}
                color="green"
              />
              { gamestate && gamestate.buyGear ?
		<LinkButton as='a' href="/gear"
			    size="large" color="orange" target="_blank"
			    icon={<Icon name="shopping cart" />}
			    content="Buy Gear"
		/>
		: "" }
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </section>
      </Segment>
      </Container>
    );
  }
}

HomeDonate0 = GamestateComp(HomeDonate0);
export default HomeDonate0;
