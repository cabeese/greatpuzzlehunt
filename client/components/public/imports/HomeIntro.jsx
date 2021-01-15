import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { Link } from 'react-router';
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
                  <p>Teams of up to 6 people solve a total of four hour-long puzzles gathering clues along the way to solve one final meta puzzle.</p>
                  <p>These are no ordinary puzzles though! It will take a diverse set of skills and talents to solve them! Our mission is to celebrate everyone's talents and demonstrate knowledge comes in many forms. Everything is timed using your phone, QR codes, and our online game platform! So yes, you can win! :)</p>
                </Segment>
              </Container>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row columns={3}>
            <Grid.Column>
              <Segment padded inverted color='blue' >
                <Header as='h1' size="medium">Who?</Header>
                Everyone! However, each participant under age 14 must have permission from a parent/legal guardian. The puzzles are created for ages 14 and older.
              </Segment>
              <Segment padded inverted color='blue' >
                <Header as='h1' size="medium">Where?</Header>
                {/* virtualeventonly
                 Red Square<br/>
                Western Washington University<br/>
                516 High Street<br/>
                Bellingham, WA 98225<br/><br/> 
                */}
                <p>The 2021 Puzzle Hunt is virtual, so anywhere that has internet access, a smartphone or computer, a black and white printer, and materials listed in the FAQs <a href="/faq" style={{color: "#bad80a"}}>What should I have on hand?</a></p>
              </Segment>
            </Grid.Column>
            <Grid.Column>
              <Segment padded inverted color='blue' >
                <Header as='h1' size="medium" >What?</Header>
                <p>Hands-on brain adventures involving paper-folding, logic, patterns, and a variety of skill sets.</p>
              </Segment>
              <Segment padded inverted color='blue' >
                <Header as='h1' size="medium" >Why?</Header>
                Stretch your mental muscles, bond with your teammates, compete alongside people of all ages and walks of life, and have a lot of fun!
              </Segment>
            </Grid.Column>
            <Grid.Column>
              <Segment padded inverted color='blue' >
                <Header as='h1' size="medium" >When?</Header>
                {eventDay}, {eventDate} from 9:30 AM&ndash;4:30 PM (PST). Leaderboard posted and prizes awarded at 5:00 PM (PST).<br/>
                {/* virtualeventonly
                 Awards and Prizes* at 4:30 PM<br/>
                *Must be present at awards ceremony to claim prizes, else prizes go to the next place team.<br/> 
                */}
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
