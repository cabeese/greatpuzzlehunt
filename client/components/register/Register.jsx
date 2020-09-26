import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { Container, Header, Segment, Message, Accordion, Button, Icon } from 'semantic-ui-react';
import { Link } from 'react-router';

import GamestateComp from '../imports/GamestateComp';
import RegistrationClosed from '../imports/RegistrationClosed';
import RegisterForm from './imports/RegisterForm';

const { eventYear, registrationOpenDate } = Meteor.settings.public;

class RegisterInner extends Component {
  render() {

    const { ready, gamestate } = this.props;

    if (!ready) return <Loading />;

    let content = null;
    let iframeStyle = {
        width: '640px',
        height: '670px',
        display: 'block',
        margin: '0 auto',
        border: '0',
    };

    if (gamestate.registration) {
      content = (
        <Segment basic>
          <RegisterForm />
        </Segment>
      );
    } else {
      content = (
        <RegistrationClosed />
      );
    }

    return (
      <Container>
        <br/>
        {content}
      </Container>
    );
  }
}

Register = GamestateComp(RegisterInner);
