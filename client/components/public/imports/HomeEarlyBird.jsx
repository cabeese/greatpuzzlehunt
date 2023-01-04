import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Segment, Image, Header, Container } from 'semantic-ui-react';
import LinkButton from '../../imports/LinkButton';
import GamestateComp from '../../imports/GamestateComp'

const { eventYear, registrationOpenDate, earlyBirdLastDate, regularRegistrationStart, regularRegistrationEnd } = Meteor.settings.public;

class HomeEarlyBird extends Component {
  render() {
    const { gamestate } = this.props;
    const registrationOpen = gamestate && gamestate.registration;
    let registerButton = (
      <a style={{textDecoration:"none", fontSize: "36pt", padding: "40px", borderRadius: "10px", backgroundColor: "#bad80a", color:"black"}}>Register</a>
    );

    let link = `https://commerce.cashnet.com/TheGreatPuzzleHunt${eventYear}`;

    let urls = ["#", "#", "#", "#"];
    if (registrationOpen) {
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
            <Header size="medium" style={{color: "white"}}>
              {registrationOpen ? "Registration is Open!" : `Registration opens ${regularRegistrationStart}!`}</Header>
            </Grid.Row>
            <Grid.Row centered>
              <p>Registration {/*opens {regularRegistrationStart}, and */}ends {regularRegistrationEnd} (or earlier if capacity is reached).</p>
            </Grid.Row>
            <Grid.Row centered>
              {registerButton}
            </Grid.Row>
            <Grid.Row style={{fontSize: "12pt"}}>
              * Registration is free and open to all, anywhere in the world. Donations are gratefully accepted.<br/>
              * Each person wanting to join a team must register themselves first.<br />
              * The event is hybrid: teams may play in person or virtually.<br />
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
