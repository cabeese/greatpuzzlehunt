import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import {
  Container, Segment, Icon, Message, Button,
} from 'semantic-ui-react';

import LinkButton from '../../imports/LinkButton';
import GamestateComp from '../../imports/GamestateComp';

const { eventYear, eventDate, eventDay, earlyBirdLastDate,
        registrationCloseDate,
      } = Meteor.settings.public;

class HomeRegisterComp extends Component {
  _registrationCloseDates() {
    return (
      <span>In-person registration closes at 11:59 PM PT on {registrationCloseDate}</span>
    );
  }

  _registrationClosed() {
    return (
      <Segment textAlign='center' color='red'>
        Sorry - registration is currently closed.
      </Segment>
    );
  }

  _registrationFullyOpen() {
    return (
      <Segment textAlign='center'>
        Ready to join the fun?
        <br />
        <LinkButton
          to="/register"
          size="huge" color="blue" content="Register Now!" />
        <br />
        <small>In-person registration closes at 11:59 PM PT on {registrationCloseDate}</small>
      </Segment>
    );
  }

  _registrationVirtualOnly() {
    return (
      <Segment textAlign='center'>
        We are still accepting new VIRTUAL players. Please note that <strong>in-person registration is closed at this time.</strong>

        <br />
        <LinkButton
          to="/register"
          size="huge" color="blue" content="Register Now! (Virtual Only)" />
      </Segment>
    );
  }

  _getBody() {
    const { ready, gamestate } = this.props;
    if (!ready || !gamestate) return "";

    const { registrationInPersonOpen, registrationVirtualOpen } = gamestate;

    if (registrationInPersonOpen) return this._registrationFullyOpen();
    if (registrationVirtualOpen) return this._registrationVirtualOnly();
    return this._registrationClosed();
  }
    
  render() {
    return (
      <Container>
        {this._getBody()}
      </Container>
    );
  }
}

const HomeRegister = GamestateComp(HomeRegisterComp);
export default HomeRegister;
