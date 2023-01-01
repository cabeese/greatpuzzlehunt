import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Message, Statistic } from 'semantic-ui-react';
import moment from 'moment';

class GameCountdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      now: moment(),
      interval: Meteor.setInterval(() => this.setState({ now: moment() }), 1000),
    };
  }

  componentWillUnmount() {
    Meteor.clearInterval(this.state.interval);
  }

  render() {
    return (
      <Message info>
        <Message.Header>Waiting for the game to start...</Message.Header>
        <Message.Content>
          <br/>
          Listen for announcements on Zoom or in Red Square.
        </Message.Content>
      </Message>
    );
  }
}

GameCountdown.propTypes = {
};

export default GameCountdown;
