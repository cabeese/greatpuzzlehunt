import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { Link } from 'react-router-dom';
import { Button, Container, Grid, Header, Label, Message } from 'semantic-ui-react';
import WithRouter from '../imports/WithRouter';

import { THCheckpoints } from '../../../lib/collections/thcheckpoints.js';
import { Teams } from '../../../lib/collections/teams.js';

class TreasureCheckpointInner extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { ready } = this.props;
    const { checkpoints, team } = this.props;
    console.log('team:');
    console.log(team);
    console.log('checkpoints:');
    console.log(checkpoints);
    if (ready) {
      return (
	<Container>
	  { this._title() }
	  { this._content() }
	</Container>
      );
    } else {
      return(<Loading />);
    }
  }

  _title() {
    const checkpointName = this._checkpointName();
    const title = `Treasure Hunt checkpoint ${checkpointName}`;
    return ( <PuzzlePageTitle title={ title } /> );
  }

  _content() {
    const { team } = this.props;
    if (!team) {
      return <NoTeamMessage/>;
    } else if (!team.startedTreasureHunt) {
	return (
	  <Grid.Row columns='1'>
	    <Container>
	      Team { team.name } has not yet started playing the Treasure Hunt! You can start playing from your Treasure Hunt status page.
	    </Container>
	    <Link to='/treasure'>
	      <Button content='Status page' />
	    </Link>
	  </Grid.Row>
	);
    } else {
      const checkpoint = this._getCheckpoint();
      const active = this._activeCheckpoint();
      console.log('this checkpoint:');
      console.log(checkpoint);
      console.log('active checkpoint:');
      console.log(active);
      if (checkpoint.sequence < active) {
	console.log('case: already completed this checkpoint');
	return (
	  <Grid.Row columns='1'>
	    <Container>
	      You have already completed this checkpoint!
	    </Container>
	    <Link to='/treasure'>
	      <Button content='Status page' />
	    </Link>
	  </Grid.Row>
	);
      } else if (checkpoint.sequence > active) {
	console.log('case: complete previous ones first');
	return (
	  <Grid.Row columns='1'>
	    <Container>
	      You must complete the checkpoints before this one first!
	    </Container>
	    <Link to='/treasure'>
	      <Button content='Status page' />
	    </Link>
	  </Grid.Row>
	);
      } else {
	console.log('this is the right checkpoint');
	return (
	  <div>
	    <Grid.Row columns='1'>
	      <Container>
		Enter the codewords you found along the way.
	      </Container>
	    </Grid.Row>
	    { this._codewords() }
	    <Button basic content='Submit' onClick={ async () => await this._submitCodewords() } />
	    </div>
	);
      }
    }
  }

  _codewords() {
    const checkpoint = this._getCheckpoint();
    let cwcount = 0;
    if ((checkpoint.cw0 != null) && (checkpoint.cw0 != '')) {
      cwcount += 1;
    }
    if ((checkpoint.cw1 != null) && (checkpoint.cw1 != '')) {
      cwcount += 1;
    }
    if ((checkpoint.cw2 != null) && (checkpoint.cw2 != '')) {
      cwcount += 1;
    }
    if ((checkpoint.cw3 != null) && (checkpoint.cw3 != '')) {
      cwcount += 1;
    }
    if ((checkpoint.cw4 != null) && (checkpoint.cw4 != '')) {
      cwcount += 1;
    }
    // XXX pick up here: create the right number of entry fields
    return null;
  }

  async _submitCodewords() {
    console.log('submit codewords here');
  }

  _activeCheckpoint() {
    const { team } = this.props;
    const completed = team.completedCheckpoint;
    return ((completed == null) ? 0 : (completed + 1));
  }
    
  _checkpointName() {
    const checkpoint = this._getCheckpoint();
    if (checkpoint == null) {
      return ''
    } else {
      return(checkpoint.name);
    }
  }

  _getCheckpoint() {
    const { checkpoints, checkpointId } = this.props;
    const ck = checkpoints.find((c) => c.sequence == checkpointId);
    return(ck);
  }

}

TreasureCheckpointInner.propTypes = {
  ready: PropTypes.bool.isRequired,
  team: PropTypes.object,
  checkpointId: PropTypes.string,
  checkpoints: PropTypes.array
};

TreasureCheckpoint = WithRouter(withTracker((props) => {
  const { checkpointId } = props.router.params;
  const handle1 = Meteor.subscribe('teams.myTeam');
  const handle2 = Meteor.subscribe('admin.thcheckpoints');
  const user = Meteor.user();
  const ready = Boolean(handle1.ready() && handle2.ready() && user);
  console.log('tracker ready:');
  console.log(ready);
  console.log(handle1.ready());
  console.log(handle2.ready());
  console.log(user);
  const team = ready ? Teams.findOne(user.teamId) : null;
  const checkpoints = ready ? THCheckpoints.find({}).fetch() : null;
  return {
    ready,
    team,
    checkpointId,
    checkpoints
  };
})(TreasureCheckpointInner));

