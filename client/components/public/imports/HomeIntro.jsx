import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Grid,
  Container,
  Image,
  Header,
  Segment,
  Button,
  Icon,
  List,
  Embed,
} from 'semantic-ui-react';
import Video from './Video';
import LinkButton from '../../imports/LinkButton';

const { eventDate, eventDay } = Meteor.settings.public;

export default class HomeIntro extends Component {
  render() {
    return (
      <div id="HomeIntro">
        <Container className="section">
        <Segment basic>
        <Grid padded stackable centered textAlign='left'>
          <Grid.Row>
            <Grid.Column width={16} className='raised'>
              <Container textAlign='left'>
                <br />
                <Header size='medium'>What is the Puzzle Hunt?</Header>
                <Segment basic size='large' className="no-padding">
                  <p>For in-person participants, the Great Puzzle Hunt is like a scavenger hunt adventure with puzzles. Teams of up to 6 people travel on foot to various locations on WWU campus solving a total of four hour-long puzzles gathering clues along the way to solve one final meta puzzle.</p>
                  <p>These are no ordinary puzzles though! It will take a diverse set of skills and talents to solve them! Our mission is to celebrate everyone's talents and demonstrate knowledge comes in many forms. Everything is timed using your phone, QR codes, and this online system! So yes, you can win :)</p>
                </Segment>
              </Container>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row columns={3}>
            <Grid.Column>
              <Segment padded inverted color='blue' >
                <Header as='h1' size="medium">Who?</Header>
                Everyone! However, each team with participant(s) under age 14 must include at least one registered adult team member to accompany minor(s) at all times. *Note: The puzzles are created for ages 14 and older.
              </Segment>
              <Segment padded inverted color='blue' >
                <Header as='h1' size="medium" >What?</Header>
                <p>Hands-on brain adventures involving paper-folding, logic, patterns, and a variety of skill sets.</p>
                FOOD, SWAG, MUSIC, PRIZES!
              </Segment>
            </Grid.Column>
            <Grid.Column>
              <Segment padded inverted color='blue' >
                <Header as='h1' size="medium" >When?</Header>
                {eventDay}, {eventDate} from 9:30 AM&ndash;4:30 PM (PT). Leaderboard posted and prizes awarded at 5:00 PM (PT).<br/>
                {/* virtualeventonly
                 Awards and Prizes* at 4:30 PM<br/>
                *Must be present at awards ceremony to claim prizes, else prizes go to the next place team.<br/> 
                */}
              </Segment>
              <Segment padded inverted color='blue' >
                <Header as='h1' size="medium">Where?</Header>
                <strong>In Person:</strong> Red Square<br/>
                Western Washington University<br/>
                516 High Street<br/>
                Bellingham, WA 98225<br/><br/> 
                <strong>Virtual:</strong> Anywhere that has internet access, a smartphone or computer, a printer, and materials to be listed in the FAQs <a href="/faq" style={{color: "#bad80a"}}>What should I have on hand?</a>
              </Segment>
            </Grid.Column>
            <Grid.Column>
              <Segment padded inverted color='blue' >
                <Header as='h1' size="medium" >Why?</Header>
                Stretch your mental muscles, bond with your teammates, compete alongside people of all ages and walks of life, and have a lot of fun!
              </Segment>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        </Segment>
        </Container>
      </div>
     );
  }
}
