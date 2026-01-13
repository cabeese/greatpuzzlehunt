import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { Link } from 'react-router-dom';
import { Button, Container, Form, Grid, Header, Label, Message } from 'semantic-ui-react';
import WithRouter from '../imports/WithRouter';

import { THCheckpoints } from '../../../lib/collections/thcheckpoints.js';
import { Teams } from '../../../lib/collections/teams.js';
import { formatLabel } from './imports/format';

class TreasureCheckpointInner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      answer: '',
      message: null,
      error: null,
    }
  }

  render() {
    const { ready } = this.props;
    const { checkpoints, team } = this.props;
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
      if (checkpoint == null) {
	return (
	  <Grid.Row columns='1'>
	    <Container>
	      Invalid checkpoint!
	    </Container>
	    <Link to='/treasure'>
	      <Button content='Status page' />
	    </Link>
	  </Grid.Row>
	);
      }
      const active = this._activeCheckpoint();
      if (checkpoint.sequence < active) {
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
	return (
	  <Grid.Row columns='1'>
	    <Container>
	      You must complete all the previous checkpoints first!
	    </Container>
	    <Link to= '/treasure'>
	      <Button content='Status page' />
	    </Link>
	  </Grid.Row>
	);
      } else {
	if (checkpoint.hasCodeword) {
	  const codewordLabel = checkpoint.codewordLabel;
	  const cwl = this._label(checkpoint);
	  return (
	    <Form onSubmit = { async (e) => await this._handleSubmit(e) }>
	      { cwl }
	      <Form.Input
		inline
		name = 'answer'
		label = 'Codeword:'
		value = { this.state.answer }
		onChange = { (e) => this._handleChange(e) }
	      />
	      <Form.Button basic fluid
			   color='green'
			   content='Submit Answer'
			   disabled={this.state.loading} />
	      { this._message() }
	      { this._error() }
	    </Form>
	  );
	} else {
	  return (
	    <Form onSubmit = { async (e) => await this._handleSubmit(e) }>
	      You found the checkpoint! 
              <Form.Button basic fluid color='green' content='Continue'
			   disabled={this.state.loading} />
	      { this._message() }
	      { this._error() }
	    </Form>
	  );
	}
      }
    }
  }

  _label(checkpoint) {
    if (checkpoint.codewordLabel == null) {
      return(<p> Enter the codeword you found along the way. </p>);
    } else {
      return(formatLabel(checkpoint.codewordLabel));
    }
  }

  async _handleSubmit(e) {
    const nonCharacterDigit = /[^a-zA-Z0-9]/ug
    const answer = this.state.answer.replaceAll(nonCharacterDigit, '');

    try {
      this.setState({ loading: true });
      const { checkpointId } = this.props;
      const result = await Meteor.callAsync('team.treasure.answer', checkpointId, answer);
      this.setState({ answer: '', error: ''});

      const { success, message } = result;
      if (success) {
	window.location.href = '/treasure';
      } else {
	if (message) {
	  this.setState({ message });
	} else {
	  this.setState({ message: null });
	}
      }
    } catch (err) {
      this.setState({ error: err.message });
    }
    this.setState({ loading: false });
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

  _handleChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  _message() {
    const { message } = this.state;
    if (message) {
      return (
	<Message>
	  { message }
	</Message>
      );
    } else {
      return null;
    }
  }

  _error() {
    const { error } = this.state;
    if (!error) {
      return null;
    }
    return <Message
      negative
      content={ error }
      onDismiss={ () => this.setState({ error: null }) }
    />
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
  const team = ready ? Teams.findOne(user.teamId) : null;
  const checkpoints = ready ? THCheckpoints.find({}).fetch() : null;
  return {
    ready,
    team,
    checkpointId,
    checkpoints
  };
})(TreasureCheckpointInner));

