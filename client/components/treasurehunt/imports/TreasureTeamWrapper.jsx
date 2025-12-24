import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Button, Container, Grid, Header, Label, Message } from 'semantic-ui-react';

import TeamComp from '../../imports/TeamComp';
// import GameUI from './GameUI.jsx';

class TreasureTeamWrapper extends Component {
  render() {
    const { ready } = this.props;
    return (
      <Container>
        {this._title()}
	{ ready ? this._content() : this._loading() }
      </Container>
    );
  }

  _title() {
    return ( <PuzzlePageTitle title='Treasure Hunt status' /> );
  }

  _loading() {
    return <Loading/>;
  }

  _content() {
    const { user, team } = this.props;
    if (!team) {
      return <NoTeamMessage/>;
    } else {
      return (
	<div>
	  { this._subtitle() }
	  { this._checkinStatus() }
	  { this._huntStatus() }
	</div>
      );
    }
  }

  _subtitle() {
    const { team } = this.props;
  }

  _checkinStatus() {
    const { team } = this.props;
    if (team) {
      if (team.startedTreasureHunt) {
	return (
	  <Message info>
	    <Message.Header>
	      Team { team.name } has started playing
	    </Message.Header>
	    <Button basic size='small' content='Clear playing'
		    color='black'
		    onClick={ async () => await this._clearPlaying() }
		    />
	  </Message>
	);
      } else {
	return (
	  <Grid.Row columns='1'>
	    <Container>
	      Team { team.name } has not yet started playing
	    </Container>
	    <Button basic size='small' content='Start playing'
		    color='black'
		    onClick={ async () => await this._startPlaying() }
		    />
	  </Grid.Row>
	);
      }
    } else {
      return (
	<Message warning size="large">
	  <Message.Header>
	    No team!
	  </Message.Header>
	</Message>
      );
    }
  }

  _huntStatus() {
    const { team } = this.props;
    if (team) {
      if (team.startedTreasureHunt) {
	return (
	  <Grid stackable>
	    <Grid.Row columns='1'>
	      <Header content='Checkpoints' />
	    </Grid.Row>
	  </Grid>
	);
      } else {
	return null;
      }
    } else {
      return (
	<Message warning size="large">
	  <Message.Header>
	    No team!
	  </Message.Header>
	</Message>
      );
    }
  }

  async _startPlaying() {
    const { team } = this.props;
    const teamId = team._id;
    console.log('Start playing!');
    console.log(teamId);
    try {
      await Meteor.callAsync('team.startTreasureHunt', teamId);
      console.log('back from start TH');
    } catch (error) {
      console.log(error);
      alert(error.reason);
    }
  }

  async _clearPlaying() {
    const { team } = this.props;
    const teamId = team._id;
    console.log('clear playing!');
    console.log(teamId);
    try {
      await Meteor.callAsync('team.clearTreasureHunt', teamId);
      console.log('back from clear TH');
    } catch (error) {
      console.log(error);
      alert(error.reason);
    }
  }
}

TreasureTeamWrapper.propTypes = {
  ready: PropTypes.bool.isRequired,
  team: PropTypes.object,
  user: PropTypes.object.isRequired,
};

export default TeamComp(TreasureTeamWrapper);
