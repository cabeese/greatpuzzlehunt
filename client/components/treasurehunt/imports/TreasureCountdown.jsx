import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Message, Statistic } from 'semantic-ui-react';
import moment from 'moment';

class TreasureCountdown extends Component {
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
        <Message.Header>Waiting for the Treasure Hunt to start...</Message.Header>
        <Message.Content>
          <br/>
	  Treasure Hunt will open after the Puzzle Hunt has completed.
        </Message.Content>
      </Message>
    );
  }
}

TreasureCountdown.propTypes = {
};

export default TreasureCountdown;
