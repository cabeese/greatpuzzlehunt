import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container, Button } from 'semantic-ui-react';

import GameStats from './GameStats';
import GamePuzzles from './GamePuzzles';
import CheckInPacket from './CheckInPacket'; // virtualeventonly

class GameUI extends Component {
  render() {
    const { team } = this.props;
    if (!team.hasBegun) {
      return <Button fluid size='big' color='blue'
                     content='Click to Begin'
                     onClick={async () => await this._begin() } />;
    } else if (!team.puzzles) {
      return <Loading/>;
    } else {
      return this._main();
    }
  }

  async _begin() {
    try {
      await Meteor.callAsync('team.begin');
    } catch (error) {
      alert(`Oops! ${error.reason}`);
    }
  }

  _main() {
    const { team, user } = this.props;
    const { inPerson } = team;
    return (
      <div>
        <GameStats team={ team }/>
        {inPerson ? "" : <CheckInPacket />}
        <GamePuzzles team={ team } user={ user }/>
      </div>
    );
  }
}

GameUI.propTypes = {
  team: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
};

export default GameUI;
