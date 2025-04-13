import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Checkbox, Container, Form, Icon,
	 Input, Message, Modal, Tab } from 'semantic-ui-react';
import { getPuzzleScore } from '../../../../../lib/imports/puzzle-helpers';
import { renderScore } from '../../../imports/PuzzleProgress';
import moment from 'moment';

class AdminTeamPuzzleEdit extends Component {
  constructor(props) {
    super(props);
    this.state = { startEndOrderError: false,
		   startHHError: false,
		   startMMError: false,
		   startSSError: false,
		   endHHError: false,
		   endMMError: false,
		   endSSError: false,
		 };
    this._isAnError.bind(this);
  }

  _setupEditCopy() {
    this.editPuzzle = {
      start: this.props.puzzle.start,
      end: this.props.puzzle.end,
      hints: this.props.puzzle.hints,
      puzzleId: this.props.puzzle.puzzleId,
      timedOut: this.props.puzzle.timedOut,
      score: this.props.puzzle.score
    };
    this.setState({...this.props.puzzle});
  }

  render() {
    const { team, puzzle, clearPuzzle } = this.props;
    if (!team || !puzzle) {
      return null;
    }

    if (!this.editPuzzle) {
      this._setupEditCopy();
      return null;
    }

    let pstart = null;
    let pstarttext = '--';
    let pstarthh = '0';
    let pstartmm = '0';
    let pstartss = '0';
    if (puzzle.start) {
      pstarttext = moment(puzzle.start).format("HH:mm:ss");
    }
    if (this.state.start) {
      pstart = moment(this.state.start);
      pstarthh = pstart.hour();
      pstartmm = pstart.minute();
      pstartss = pstart.second();
    }
    
    let pend = null;
    let pendtext = '--';
    let pendhh = '0';
    let pendmm = '0';
    let pendss = '0';
    if (puzzle.end) {
      pendtext = moment(puzzle.end).format("HH:mm:ss");
    }
    if (this.state.end) {
      pend = moment(this.state.end);
      pendhh = pend.hour();
      pendmm = pend.minute();
      pendss = pend.second();
    }

    let hintsTaken = [];
    puzzle.hints.forEach((hint, index) => {
      const name = hint.taken? 'check square' : 'square outline';
      hintsTaken.push(<Icon key={index} name={name} />);
    });

    let hintsEdit = [];
    this.state.hints.forEach((hint, index) => {
      const boxname = 'hint' + index;
      hintsEdit.push(<Checkbox name={boxname}
			       onChange={async (e, data) => await this._handleCheckChange(e, data)}
			       checked={hint.taken}
		     />);
      hintsEdit.push('\u00A0\u00A0');
    });

    const timedOut = puzzle.timedOut ? 'check square' : 'square outline' ;
    const editTimedOut = this.state.timedOut ? 'check square' : 'square outline' ;
    const scoreDiff = this.state.score.toFixed(1) - puzzle.score.toFixed(1);
    const scorePrefix = (scoreDiff > 0) ? '+' : '';
    
    return (
      <Modal
        size="large"
        open={true}
        closeIcon={true}
        onClose={() => clearPuzzle() }
      >
        <Modal.Header>Edit times for {team.name}: {puzzle.name}</Modal.Header>
	
	{ this.state.startEndOrderError ?
	  <Message error icon='warning'>
	    End time must be later than start time
	  </Message>
	  
	  : null
	}
	
	{ this.state.saveError ?
	  <Message error icon='warning'
		   onDismiss={(e) => this.setState({saveError: null})}
		   title='Issues saving puzzle play update'
		   content={this.state.saveError.reason} />
	  : null
	}
	
        <Modal.Content>
	  <Form>

	    <Form.Group inline>
	      <Form.Field width={3}>
		<label> Start </label>
		<Container> {pstarttext} </Container>
	      </Form.Field>
	      <Form.Field width={2} error={this.state.startHHError}>
		<Input name='start-hh'
                       onChange={async (e, data) => await this._handleStartDataChange(e, data)}
		       value={pstarthh}
		/>
	      </Form.Field>
	      <Form.Field width={2} error={this.state.startMMError}>
		<label> : </label>
		<Input name='start-mm'
                       onChange={async (e, data) => await this._handleStartDataChange(e, data)}
		       value={pstartmm}
		/>
	      </Form.Field>
	      <Form.Field width={2} error={this.state.startSSError}>
		<label> : </label>
		<Input name='start-ss'
                       onChange={async (e, data) => await this._handleStartDataChange(e, data)}
		       value={pstartss}
		/>
	      </Form.Field>
	      <Form.Field width={1}>
		{'\u00A0'} 
	      </Form.Field>
	      <Form.Field width={1}>
		<Button onClick={this._resetStart.bind(this)}
			content='Reset'
			basic
		/>
	      </Form.Field>
	    </Form.Group>

	    <Form.Group inline>
	      <Form.Field width={3}>
		<label> End </label>
		<Container> {pendtext} </Container>
	      </Form.Field>
	      <Form.Field width={2} error={this.state.endHHError} inline>
		<Input name='end-hh'
                       onChange={async (e, data) => await this._handleEndDataChange(e, data)}
		       value={pendhh}
		/>
	      </Form.Field>
	      <Form.Field width={2} error={this.state.endMMError} inline>
		<label> : </label>
		<Input name='end-mm'
                       onChange={async (e, data) => await this._handleEndDataChange(e, data)}
		       value={pendmm}
		/>
	      </Form.Field>
	      <Form.Field width={2} error={this.state.endSSError} inline>
		<label> : </label>
		<Input name='end-ss'
                       onChange={async (e, data) => await this._handleEndDataChange(e, data)}
		       value={pendss}
		/>
	      </Form.Field>
	      <Form.Field width={1}>
		{'\u00A0'} 
	      </Form.Field>
	      <Form.Field width={1}>
		<Button onClick={this._resetEnd.bind(this)}
			content='Reset'
			basic
		/>
	      </Form.Field>
	    </Form.Group>

	    <Form.Group>
	      <Form.Field width={3}>
		<label> Hints taken </label>
		<Container> {hintsTaken} </Container>
	      </Form.Field>
	      <Form.Field width={2}>
		<label> {'\u00A0'} </label>
		<Container> {hintsEdit} </Container>
	      </Form.Field>
	      <Form.Field width={1}>
		{'\u00A0'} 
	      </Form.Field>
	      <Form.Field width={1}>
		<label> {'\u00A0'} </label>
		<Button onClick={this._resetHints.bind(this)}
			content='Reset'
			basic
		/>
	      </Form.Field>
	    </Form.Group>
	    
	    <Form.Group>
	      <Form.Field width={3}>
		<label> Timed out </label>
		<Container> <Icon key='timeOut' name={timedOut} /> </Container>
	      </Form.Field>
	      <Form.Field width={4}>
		<label> {'\u00A0'} </label>
		<Container> <Icon key='timeOut' name={editTimedOut} /> </Container>
	      </Form.Field>
	    </Form.Group>
	    <Form.Group>
	      <Form.Field width={3}>
		<label> Score </label>
		<Container> {renderScore(puzzle.score).time} ({puzzle.score.toFixed(1)} sec) </Container>
	      </Form.Field>
	      <Form.Field width={3}>
		<label> New score </label>
 	      <Container> {renderScore(this.state.score).time} ({this.state.score.toFixed(1)} sec) </Container>
	      <Container> Diff {scorePrefix}{scoreDiff} </Container>
	      </Form.Field>
	      <Form.Field width={1}>
		<Button
		  type='submit'
		  color='green'
		  content='Save'
		  disabled={this._isAnError()}
		  onClick={async (e) => await this._update(e)}
		/>
	      </Form.Field>
	    </Form.Group>
	  </Form>
        </Modal.Content>
	
	<Modal.Actions>
          <Button
            basic
            onClick={clearPuzzle}
            icon={ <Icon name="close" /> }
            content="Close"
          />
	</Modal.Actions>
      </Modal>
    );
  }

  async _handleStartDataChange(e, data) {
    const { name } = data;

    let startEdit = moment(this.state.start);
    let hhErr = false;
    let mmErr = false;
    let ssErr = false;
    if (name == 'start-hh') {
      if ((data.value < 0) || (data.value > 23)) {
	hhErr = true
      } else {
	startEdit.hour(data.value);
      }
    } else if (name == 'start-mm') {
      if ((data.value < 0) || (data.value > 59)) {
	mmErr = true
      } else {
	startEdit.minute(data.value);
      }
    } else if (name == 'start-ss') {
      if ((data.value < 0) || (data.value > 59)) {
	ssErr = true;
      } else {
	startEdit.second(data.value);
      }
    }
    this.editPuzzle.start = startEdit.toDate();
    this.setState({ start: startEdit.toDate(),
		    startHHError: hhErr,
		    startMMError: mmErr,
		    startSSError: ssErr
		  });
    await this._recalculateScore();
  }

  async _handleEndDataChange(e, data) {
    const { name } = data;

    let endEdit = moment(this.editPuzzle.end);
    let hhErr = false;
    let mmErr = false;
    let ssErr = false;
    if (name == 'end-hh') {
      if ((data.value < 0) || (data.value > 23)) {
	hhErr = true
      } else {
	endEdit.hour(data.value);
      }
    } else if (name == 'end-mm') {
      if ((data.value < 0) || (data.value > 59)) {
	mmErr = true
      } else {
	endEdit.minute(data.value);
      }
    } else if (name == 'end-ss') {
      if ((data.value < 0) || (data.value > 59)) {
	ssErr = true;
      } else {
	endEdit.second(data.value);
      }
    }
    this.editPuzzle.end = endEdit.toDate();
    this.setState({ end: endEdit.toDate(),
		    endHHError: hhErr,
		    endMMError: mmErr,
		    endSSError: ssErr
		  });
    await this._recalculateScore();
  }

  async _handleCheckChange(e, data) {
    const { name } = data;
    const oldHints = this.editPuzzle.hints;
    let newHints = [];
    // update the hints by looping so that there is no dependency on
    // the number of hints involved, as opposed to trying to compute
    // an indenx into the array
    oldHints.forEach((hint, index) => {
      const boxname = 'hint' + index;
      if (boxname === name) {
	newHints.push({...hint, taken: data.checked});
      } else {
	newHints.push(hint);
      }
    });
    this.editPuzzle.hints = newHints;
    this.setState({ hints: newHints });
    await this._recalculateScore();
  }

  async _recalculateScore() {
    this.setState( { startEndOrderError: (this.editPuzzle.start >= this.editPuzzle.end) });

    try {
      const res = await Meteor.callAsync('admin.team.computeScore', this.editPuzzle);
      const [newTimeout, newScore] = res;
      this.editPuzzle.score = newScore;
      this.editPuzzle.timedOut = newTimeout;
      this.setState({ score: newScore, timedOut: newTimeout });
    } catch (err) {
      console.log('recalculate score error');
      console.log(err);
    }
  }

  async _resetStart() {
    this.editPuzzle.start = this.props.puzzle.start;
    this.setState({ start: this.props.puzzle.start,
		    startHHError: false,
		    startMMError: false,
		    startSSError: false
		  });
    await this._recalculateScore();
  }

  async _resetEnd() {
    this.editPuzzle.end = this.props.puzzle.end;
    this.setState({ end: this.props.puzzle.end,
		    endHHError: false,
		    endMMError: false,
		    endSSError: false
		  });
    await this._recalculateScore();
  }

  async _resetHints() {
    this.editPuzzle.hints = this.props.puzzle.hints;
    this.setState({ hints: this.props.puzzle.hints });
    await this._recalculateScore();
  }

  _isAnError() {
    return (this.state.startEndOrderError ||
	    this.state.startHHError ||
	    this.state.startMMError ||
	    this.state.startSSError ||
	    this.state.endHHError ||
	    this.state.endMMError ||
	    this.state.endSSError ||
	    (this.state.saveError != null) );
  }

  async _update(e) {
    e.preventDefault();

    try {
      await Meteor.callAsync('admin.team.updatePuzzlePlay',
		             this.props.team._id,
		             this.editPuzzle);
      this.setState({saveError: null});
      alert('Puzzle play information updated');
    } catch (err) {
      alert(`Failed to update puzzle play information. ${err}`);
      this.setState({saveError: err});
    }
  }
}

AdminTeamPuzzleEdit.propTypes = {
  team: PropTypes.object,
  puzzle: PropTypes.object,
  clearPuzzle: PropTypes.func.isRequired,
};

export default AdminTeamPuzzleEdit;
