import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { Grid, Container, Segment, List, Icon, Message, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import GamestateComp from '../../imports/GamestateComp'

const { eventYear, eventDate, eventDay, earlyBirdLastDate, registrationCloseDate } = Meteor.settings.public;

class HomeAnnouncements extends Component {

  render() {
    const gamestate = this.props.gamestate || {};

    if (gamestate.message1show || gamestate.message2show) {
      return (
	<section id="home-announcements">
	  
	  <Grid padded stackable centered textAlign='left'>
            <Grid.Row>
              <Grid.Column width={16} className='raised'>
		<Container textAlign='left'>
		  <Message size='huge' warning>
                    <Message.Content>
                      <Segment basic size='large' className='no-padding' style={{lineHeight: "normal"}}>
			<List>
			  { this._message1(gamestate) }
			  { this._message2(gamestate) }
			</List>
                      </Segment>
                    </Message.Content>
                  </Message>
		</Container>
              </Grid.Column>
            </Grid.Row>
	  </Grid>
	  
	</section>
      );
    } else {
      return null;
    }
  }

  _message(mshow, micon, mtext, murl) {
    if (mshow) {
      const icon = micon && (micon != 'none') && (micon != '');
      const i = <List.Icon name={micon} />
      const url = murl && (murl != 'none') && (murl != '');
      const u = url ? <a href={ murl }> { murl } </a> : null;
      return (
	<List.Item>
	  {  icon ? i : null }
          <List.Content>
	    { mtext } &nbsp;
	    { u }
          </List.Content>
	</List.Item>
      );
    } else {
      return null;
    }
  }

  _message1(gamestate) {
    return this._message(gamestate.message1show, gamestate.message1icon,
		  gamestate.message1text, gamestate.message1url)
  }

  _message2(gamestate) {
    return this._message(gamestate.message2show, gamestate.message2icon,
		  gamestate.message2text, gamestate.message2url)
  }

}

HomeAnnouncements = GamestateComp(HomeAnnouncements);
export default HomeAnnouncements
