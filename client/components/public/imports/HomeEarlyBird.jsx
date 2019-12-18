import React, { Component, PropTypes } from 'react';
import { Grid, Segment, Image, Header } from 'semantic-ui-react';
import LinkButton from '../../imports/LinkButton';
import GamestateComp from '../../imports/GamestateComp'

const { earlyBirdLastDate, regularRegistrationStart, regularRegistrationEnd } = Meteor.settings.public;

class HomeEarlyBird extends Component {
  render() {
    const { gamestate } = this.props;
    const registration = gamestate && gamestate.registration;
    const registerButton = (
      <Segment basic textAlign="center">
        <LinkButton to='/register' size='huge' content='Register'/>
      </Segment>
    );

    return (
      <section id="home-early-bird">
        <Segment inverted color='blue' style={{ padding: '4em 0em', margin:'0'}} className="no-border-radius">
          <Grid   stackable  textAlign='left' >
           <Grid.Row centered verticalAlign="top">

              <Grid.Column width={8}>
                <Image fluid src="/img/2016/event-photos/station1.jpg"/>
                { registration ? registerButton : null }
             </Grid.Column>

             <Grid.Column width={6}>

               <Segment inverted color='blue'>
                 <Header as="h1" size="huge">Early Bird Registration Until {earlyBirdLastDate}</Header>
                 Student   $5<br/><br/>
                 Non-Student   $10<br/><br/><br/>
               </Segment>

                <Segment  inverted color='blue'>
                  <Header as="h1" size='huge'>Regular Registration</Header>
                  {regularRegistrationStart} through {regularRegistrationEnd}<br/><br/>
                  Student   $8<br/><br/>
                  Non-Student   $15<br/><br/>
                  * Registration prices are per person. Each person wanting to join a team must register themselves first.
                </Segment>

              </Grid.Column>
           </Grid.Row>
         </Grid>
     </Segment>
      {/* <Image fluid src='/img/2016/event-photos/team-theres-waldo-thin.jpeg'/> */}
    </section>

    );
  }
}

HomeEarlyBird = GamestateComp(HomeEarlyBird);
export default HomeEarlyBird
