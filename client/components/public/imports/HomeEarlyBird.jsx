import React, { Component, PropTypes } from 'react';
import { Grid, Segment, Image, Header, Container } from 'semantic-ui-react';
import LinkButton from '../../imports/LinkButton';
import GamestateComp from '../../imports/GamestateComp'

const { eventYear, registrationOpenDate, earlyBirdLastDate, regularRegistrationStart, regularRegistrationEnd } = Meteor.settings.public;

class HomeEarlyBird extends Component {
  render() {
    const { gamestate } = this.props;
    const registration = gamestate && gamestate.registration;
    const registerButton = (
      <a href="/register" target="_blank" style={{textDecoration:"none", fontSize: "36pt", padding: "40px", borderRadius: "10px", backgroundColor: "#bad80a", color:"black"}}>Register</a>
    );
    
    let link = `https://commerce.cashnet.com/TheGreatPuzzleHunt${eventYear}`;

    return (
      
      <section id="home-registration">
        <Segment style={{ fontSize: "14pt", color: "white", backgroundColor: '#003f87', padding: '4em 0em', margin:'0'}} className="no-border-radius">
        <Container>
          <Grid padded stackable  textAlign='left' >
          <Grid.Row centered>
            <Header size="medium" style={{color: "white"}}>Registration is a 4-step process:</Header>
           </Grid.Row>
           <Grid.Row width={16} columns={4} centered verticalAlign="top">
            
            <Grid.Column textAlign="center">
              <span className="step-number">1</span>
              <a href="/register">Create</a> an account.<br />Verify your email before continuing.
            </Grid.Column>
            <Grid.Column textAlign="center">
              <span className="step-number">2</span>
              <a href={link}>Acquire</a> ticket code(s).<br />Ticket code(s) will be sent to your email.
            </Grid.Column>
            <Grid.Column textAlign="center">
              <span className="step-number">3</span>
              <a href="/redeem">Redeem</a> ticket code(s).
            </Grid.Column>
            <Grid.Column textAlign="center">
              <span className="step-number">4</span>
              Set-up/join <a href="/team">team</a>.
            </Grid.Column>
           </Grid.Row>
           <Grid.Row centered>
           <p>Registration opens {regularRegistrationStart}, and ends {regularRegistrationEnd}.</p>
           </Grid.Row>
           <Grid.Row centered>
           {registerButton}
           <br/>
           </Grid.Row>
            <Grid.Row centered width={16} columns={2}>
              {/* <Grid.Column>
                 <Header size="medium" style={{color: "white"}}>Early Bird Registration</Header>
                  {registrationOpenDate} through {earlyBirdLastDate}<br /><br />
                  Student   $5<br/><br/>
                  Non-Student   $10<br/><br/><br/>
               </Grid.Column> */}

                {/* <Grid.Column>
                  <Header size="medium" style={{color: "white"}}>Regular Registration</Header>
                    {regularRegistrationStart} through {regularRegistrationEnd}<br/><br/>
                    Student   $8<br/><br/>
                    Non-Student   $15<br/><br/>
                </Grid.Column> */}
                
            </Grid.Row>
            <Grid.Row style={{fontSize: "12pt"}}>
                {/* *Registration prices are per person. Each person wanting to join a team must register themselves first.<br /><br /> */}
                *Registration is free and open to all, anywhere in the world. Donations are gratefully accepted.<br/>
                *Each person wanting to join a team must register themselves first. Each participant under age 14 must have permission from parent/legal guardian. The puzzles are created for ages 14 and older.
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
