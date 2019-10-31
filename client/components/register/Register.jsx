import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { Container, Header, Segment, Message, Accordion, Button, Icon } from 'semantic-ui-react';
import { Link } from 'react-router';

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

    if (gamestate.registration) {
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
			  content={`Registration for the ${eventYear} Great Puzzle Hunt will open ${registrationOpenDate}.`}
			/>
			<iframe style={iframeStyle} src="https://docs.google.com/forms/d/e/1FAIpQLScKOX4r9pJhxmPUUaroFoBhOwVhREsN7G7Z5GARHG9AcZVQQQ/viewform?embedded=true">Loading…</iframe>
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
