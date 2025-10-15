import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { Container, Header, Segment, Message, Accordion, Button, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import GamestateComp from '../imports/GamestateComp';
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

    if (gamestate.registrationInPersonOpen ||
        gamestate.registrationVirtualOpen ||
        gamestate.registrationTHOnlyOpen) {
      content = (
        <Segment basic>
          <RegisterForm />
        </Segment>
      );
    } else {
      content = (
	<div>
          <Message
            info size='large'
            header='Registration is Closed'
	    content={`Registration is closed at this time.`}
	  />
	</div>
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
