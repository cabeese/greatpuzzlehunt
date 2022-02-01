import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Segment, Image, Header, Container } from 'semantic-ui-react';
import LinkButton from '../../imports/LinkButton';
import GamestateComp from '../../imports/GamestateComp'

const { eventYear, registrationOpenDate, earlyBirdLastDate, regularRegistrationStart, regularRegistrationEnd } = Meteor.settings.public;

class HomeEarlyBird extends Component {
  render() {
    const { gamestate } = this.props;
    const registration = gamestate && gamestate.registration;
    let registerButton = (
      <a style={{textDecoration:"none", fontSize: "36pt", padding: "40px", borderRadius: "10px", backgroundColor: "#bad80a", color:"black"}}>Register</a>
    );

    let link = `https://commerce.cashnet.com/TheGreatPuzzleHunt${eventYear}`;

    let urls = ["#", "#", "#", "#"];
    if (gamestate && gamestate.registration) {
      registerButton = (
        <a href="/register" target="_blank" style={{textDecoration:"none", fontSize: "36pt", padding: "40px", borderRadius: "10px", backgroundColor: "#bad80a", color:"black"}}>Register</a>
      );
      urls = ["/register", link, "/redeem", "/team"];
    }

    return (
      
      <section id="home-registration">
        <Segment style={{ fontSize: "14pt", color: "white", backgroundColor: '#003f87', padding: '4em 0em', margin:'0'}} className="no-border-radius">
        <Container>
          <Grid padded stackable  textAlign='left' >
          <Grid.Row centered>
            <Header size="medium" style={{color: "white"}}>Registration is a 4-step process:</Header>
            </Grid.Row>
            <Grid.Row centered>
              <p style={{color: 'red'}}><strong>Important</strong>: In-person participants must use their WWU email address.</p>
            </Grid.Row>
            <Grid.Row width={16} columns={4} centered verticalAlign="top">
              <Grid.Column textAlign="center">
                <span className="step-number">1</span>
                <a href={urls[0]}>Create</a> an account.<br />Verify your email before continuing.
              </Grid.Column>
              <Grid.Column textAlign="center">
                <span className="step-number">2</span>
                <a href={urls[1]}>Acquire</a> ticket code(s).<br />Ticket code(s) will be sent to your email.
              </Grid.Column>
              <Grid.Column textAlign="center">
                <span className="step-number">3</span>
                <a href={urls[2]}>Redeem</a> ticket code(s).
              </Grid.Column>
              <Grid.Column textAlign="center">
                <span className="step-number">4</span>
                Set-up/join <a href={urls[3]}>team</a>.
              </Grid.Column>
            </Grid.Row>
            <Grid.Row centered>
              <p>Registration {/*opens {regularRegistrationStart}, and */}ends {regularRegistrationEnd} (or earlier if capacity is reached).</p>
            </Grid.Row>
            <Grid.Row centered>
              {registerButton}
            </Grid.Row>
            <Grid.Row centered width={16} columns={2}>
            <a href="/faq">Don't have a team?</a>
              {/* virtualeventonly
              <Grid.Column>
                 <Header size="medium" style={{color: "white"}}>Early Bird Registration</Header>
                  {registrationOpenDate} through {earlyBirdLastDate}<br /><br />
                  Student   $5<br/><br/>
                  Non-Student   $10<br/><br/><br/>
               </Grid.Column>

                <Grid.Column>
                  <Header size="medium" style={{color: "white"}}>Regular Registration</Header>
                    {regularRegistrationStart} through {regularRegistrationEnd}<br/><br/>
                    Student   $8<br/><br/>
                    Non-Student   $15<br/><br/>
                </Grid.Column> 
              */}
                
            </Grid.Row>
            <Grid.Row style={{fontSize: "12pt"}}>
              *Registration is free and open to all, anywhere in the world. Donations are gratefully accepted.<br/>
              *In-Person option is only open to WWU students, faculty, and staff.<br />
              *Each person wanting to join a team must register themselves first.<br />
              Participants under age 18 who are not enrolled WWU students: A parent/legal guardian must complete the registration form on behalf of their minor.
            </Grid.Row>
           
          </Grid>
          </Container>
      </Segment>
      {/* <Image fluid src='/img/2016/event-photos/team-theres-waldo-thin.jpeg'/> */}
      </section>

    );
  }
}

HomeEarlyBird = GamestateComp(HomeEarlyBird);
export default HomeEarlyBird
