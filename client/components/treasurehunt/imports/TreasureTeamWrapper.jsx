import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { sortBy} from 'lodash';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Button, Container, Grid, Header, Label, Message } from 'semantic-ui-react';

import { THCheckpoints } from '../../../../lib/collections/thcheckpoints.js';
import { Teams } from '../../../../lib/collections/teams.js'
import { Gamestate } from '../../../../lib/collections/gamestate-collection.js'
import { formatLabel } from './format'

class TreasureTeamWrapper extends Component {
  render() {
    const { ready } = this.props;
    
    return (
      <Container>
        { this._title() }
	{ ready ? this._content() : this._loading() }
      </Container>
    );
  }

  _title() {
    return ( <PuzzlePageTitle title='Treasure Hunt progress' /> );
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
	  { this._mapInfo() }
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
	return null;
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

  _mapInfo() {
    const { gamestate } = this.props;
    const { team } = this.props;

    if (gamestate) {
      if (team.startedTreasureHunt) {
	const mapURL = gamestate[0].treasureMapURL;
	const logURL = gamestate[0].treasureLogURL;
	
	return (
	  <Grid stackable>
	    <Grid.Row columns='1'>
	      <Header content='Information' />
	    </Grid.Row>
	    <Grid.Row>
	      <Grid.Column>
		<Container>
		  Team { team.name } has started playing
		</Container>
		<br/>
		<Container>
		  Official Treasure Hunt Map &nbsp;
		  <Button basic
			  as='a'
			  size='small'
			  content='Download'
			  href={mapURL}
		  />
		  <br/>
		  <ul>
		    <li> Download and read map from your mobile device, or </li>
		    <li> You may want to print a hard copy. </li>
		  </ul>
		</Container>
		<Container>
		  Treasure Hunt Log &nbsp;
		  <Button basic
			  as='a'
			  size='small'
			  content='Download'
			  href={logURL}
		  />
		</Container>
	      </Grid.Column>
	    </Grid.Row>
	  </Grid>
	);
      } else {
	return null;
      }
    } else {
      return null;
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
	    <Grid.Row>
	      <Grid.Column width="4">
		{ this._checkpointStatuses() }
	      </Grid.Column>
	      <Grid.Column width="12">
		{ this._checkpointMessages() }
		{ this._completionMessage() }
	      </Grid.Column>
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

  _checkpointStatuses() {
    const { checkpoints, team } = this.props;
    const completed = team.completedCheckpoint;
    const active = (completed == null) ? 0 : (completed + 1);
    const sortedCheckpoints = sortBy(checkpoints, ['sequence', 'name'])
    return (
      <Grid stackable>
	{ sortedCheckpoints.map((checkpoint) => this._oneCheckpoint(checkpoint, active)) }
      </Grid>
    );
  }

  _completionMessage() {
    const { checkpoints, team } = this.props;
    const completed = team.completedCheckpoint;
    const active = (completed == null) ? 0 : (completed + 1);
    const numck = checkpoints.length;
    if (active >= numck) {
      return (
	<div>
	  Thanks for playing the treasure hunt!
	</div>
      );
    } else {
      return null;
    }
  }

  _checkpointMessages() {
    const { checkpoints, team } = this.props;
    const completed = team.completedCheckpoint;
    const active = (completed == null) ? 0 : (completed + 1);
    const numck = checkpoints.length;
    const ckCompleted = (completed == null) ? null : checkpoints.find((c) => c.sequence == completed);
    let msgCompleted = '';
    if (ckCompleted != null) {
      msgCompleted = formatLabel(ckCompleted == null ? '' : ckCompleted.finishDescription)
      
    }
    const ckActive = checkpoints.find((c) => c.sequence == active);
    let msgActive = '';
    if (ckActive != null) {
      msgActive = formatLabel(ckActive == null ? '' : ckActive.startDescription)
    }
    return (
      <div>
	{msgCompleted} {msgActive}
      </div>
    );
  }

  _oneCheckpoint(checkpoint, active) {
    let color = 'grey';
    let ltext = '';
    if (checkpoint.sequence < active) {
      color = 'green';
      ltext = ': completed';
    } else if (checkpoint.sequence == active) {
      color = 'orange';
      ltext = ': active';
    }
    return (
      <Grid.Row columns={1} name={checkpoint._id} key={checkpoint._id}>
	<Grid.Column>
	  <Label content={checkpoint.sequence + 1} color={color}/> &nbsp;
	  {checkpoint.name} {ltext}
	  </Grid.Column>
      </Grid.Row>
    );
  }

  async _startPlaying() {
    const { team } = this.props;
    const teamId = team._id;
    try {
      await Meteor.callAsync('team.startTreasureHunt', teamId);
    } catch (error) {
      alert(error.reason);
    }
  }
}

TreasureTeamWrapper.propTypes = {
  ready: PropTypes.bool.isRequired,
  team: PropTypes.object,
  user: PropTypes.object,
  checkpoints: PropTypes.array,
  gamestate: PropTypes.array
};

function TreasureTracker(Comp) {
  return withTracker(() => {
    const handle1 = Meteor.subscribe('teams.myTeam');
    const handle2 = Meteor.subscribe('admin.thcheckpoints');
    const handle3 = Meteor.subscribe('gamestate');
    const user = Meteor.user();
    const ready = Boolean(handle1.ready() && handle2.ready() && handle3.ready() && user);
    const team = ready ? Teams.findOne(user.teamId) : null;
    const checkpoints = ready ? THCheckpoints.find({}).fetch() : null;
    const gamestate = ready? Gamestate.find({}).fetch() : null;

    return {
      user,
      ready,
      team,
      checkpoints,
      gamestate
    };
  })(Comp);
};

export default TreasureTracker(TreasureTeamWrapper);
