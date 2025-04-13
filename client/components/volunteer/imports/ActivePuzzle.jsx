import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import { Segment, Header, Progress, Button } from 'semantic-ui-react';

import PuzzleProgress from '../../imports/PuzzleProgress';

export default class ActivePuzzle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showInactivityWarning: false,
    };
    this.resetInactivityTimers = this.resetInactivityTimers.bind(this);
    this.restartInactivityTimers = this.restartInactivityTimers.bind(this);
  }

  componentDidMount() {
    this.startInactivePageTimer();
  }
  componentWillUnmount() {
    this.resetInactivityTimers();
  }

  // When the component loads, begin the first clock. When this
  // timer expires, display the note that the page is closing soon.
  startInactivePageTimer() {
    this.inactiveTimeoutPhase1 = Meteor.setTimeout(
      this.inactivePageWarn.bind(this), 1000 * 60);
  }

  // The page is about to "close" due to inactivity. Give the user a
  // chance to extend/reset the timer before this happens.
  inactivePageWarn() {
    this.setState({showInactivityWarning: true});
    this.inactiveTimeoutPhase2 = Meteor.setTimeout(
      this.goToInactivePage, 1000 * 60);
  }

  // Clear the timers tracking inactivity on this page. May be called
  // because the user requested an extension or because the component
  // is unloading (e.g. user navigating away or reset the team's
  // puzzle timer, reverting back to the UnstartedPuzzle component).
  resetInactivityTimers() {
    if (this.inactiveTimeoutPhase1) {
      Meteor.clearTimeout(this.inactiveTimeoutPhase1);
    }
    if (this.inactiveTimeoutPhase2) {
      Meteor.clearTimeout(this.inactiveTimeoutPhase2);
    }
    this.setState({showInactivityWarning: false});
  }

  // Similar to the above, but start the timer again after clearing
  // the existing timeouts (i.e. user requested extension).
  restartInactivityTimers() {
    this.resetInactivityTimers();
    this.startInactivePageTimer();
  }

  // Loads a blank-ish HTML page so that this browser tab is no longer
  // holding an open websocket connection to the server.
  goToInactivePage() {
    window.location.href = "/inactive.html";
  }

  render() {
    const { team, puzzle } = this.props;

    return (
      <Segment>
        <Header as='h3' content={ puzzle.name }/>
        <PuzzleProgress puzzle={ puzzle }/>
        <br/>
        <Button
          basic fluid
          color='red'
          content='Reset Timer'
          onClick={ async () => await this._resetTimer() }
        />
        {this._inactivityMessage()}
      </Segment>
    );
  }

  _inactivityMessage() {
    const { showInactivityWarning } = this.state;
    if (!showInactivityWarning) {
      return "";
    }
    return (
      <Button
        basic fluid
        color='yellow'
        content='This page will close in under a minute. Click to cancel'
        onClick={ this.restartInactivityTimers }
      />
    );
  }

  async _resetTimer() {
    const { team, puzzle } = this.props;
    const confirmMsg = `
You want to reset ${puzzle.name}
for team: ${team.name}?

Are you absolutely positive?
`
    if (!confirm(confirmMsg)) return;

    this.resetInactivityTimers();

    try {
      await Meteor.callAsync('volunteer.team.resetPuzzle', team._id, puzzle.puzzleId);
    } catch (error) {
      this.setState({ error });
    }
  }
}

ActivePuzzle.propTypes = {
  team: PropTypes.object.isRequired,
  puzzle: PropTypes.object.isRequired,
};
