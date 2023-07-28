import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Checkbox, Container, Form, Icon,
	 Input, Message, Modal, Tab } from 'semantic-ui-react';
import { getPuzzleScore } from '../../../../../lib/imports/puzzle-helpers';
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
  }

  _setupEditCopy() {
    console.log('in ATPE setup edit copy of puzzle');
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
    console.log("ATPE render");
    const { team, puzzle, clearPuzzle } = this.props;
    console.log("team: ", team);
    console.log("puzzle: ", puzzle);
    console.log("clearPuzzle: ", clearPuzzle);
    if (!team || !puzzle) {
      return null;
    }
    console.log("state: ", this.state);
    console.log("edit puzzle: ", this.editPuzzle);
    if (!this.editPuzzle) {
      this._setupEditCopy();
      console.log("set edit puzzle: ", this.editPuzzle);
      return null;
    }
    console.log("ATPE render actually rendering");

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
    console.log('set up start times');
    
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
    console.log('set up end times');

    let hintsTaken = [];
    puzzle.hints.forEach((hint, index) => {
      const name = hint.taken? 'check square' : 'square outline';
      hintsTaken.push(<Icon key={index} name={name} />);
    });
    console.log('set up hints taken');

    let hintsEdit = [];
    this.state.hints.forEach((hint, index) => {
      const boxname = 'hint' + index;
      hintsEdit.push(<Checkbox name={boxname}
			       onChange={(e, data) => this._handleCheckChange(e, data)}
			       checked={hint.taken}
		     />);
    });
    console.log('set up hints edit: ', hintsEdit);

    const timedOut = puzzle.timedOut ? 'check square' : 'square outline' ;
    console.log('set up timed out');
    const editTimedOut = this.state.timedOut ? 'check square' : 'square outline' ;
    console.log('set up timed out edit');
    
    return (
      <Modal
        size="large"
        open={true}
        closeIcon={true}
        onClose={() => clearPuzzle() }
      >
        <Modal.Header>Edit times for {team.name}: {puzzle.name}</Modal.Header>
	
	{ this.state.startEndOrderError ?
	  <Message error>
	    End time must be later than start time
	  </Message>
	  
	  : null
	}
	
        <Modal.Content>
	  <Form>

	    <Form.Group>
	      <Form.Field width={3}>
		<label> Start </label>
		<Container> {pstarttext} </Container>
	      </Form.Field>
	      <Form.Field width={1} error={this.state.startHHError}>
		<label> hh </label>
		<Input name='start-hh'
                       onChange={(e, data) => this._handleStartDataChange(e, data)}
		       value={pstarthh}
		/>
	      </Form.Field>
	      <Form.Field width={1} error={this.state.startMMError}>
		<label> mm </label>
		<Input name='start-mm'
                       onChange={(e, data) => this._handleStartDataChange(e, data)}
		       value={pstartmm}
		/>
	      </Form.Field>
	      <Form.Field width={1} error={this.state.startSSError}>
		<label> ss </label>
		<Input name='start-ss'
                       onChange={(e, data) => this._handleStartDataChange(e, data)}
		       value={pstartss}
		/>
	      </Form.Field>
	      <Form.Field width={1}>
		<Button onClick={this._resetStart.bind(this)}
			content='Reset'
		/>
	      </Form.Field>
	    </Form.Group>

	    <Form.Group>
	      <Form.Field width={3}>
		<label> End </label>
		<Container> {pendtext} </Container>
	      </Form.Field>
	      <Form.Field width={1} error={this.state.endHHError}>
		<label> hh </label>
		<Input name='end-hh'
                       onChange={(e, data) => this._handleEndDataChange(e, data)}
		       value={pendhh}
		/>
	      </Form.Field>
	      <Form.Field width={1} error={this.state.endMMError}>
		<label> mm </label>
		<Input name='end-mm'
                       onChange={(e, data) => this._handleEndDataChange(e, data)}
		       value={pendmm}
		/>
	      </Form.Field>
	      <Form.Field width={1} error={this.state.endSSError}>
		<label> ss </label>
		<Input name='end-ss'
                       onChange={(e, data) => this._handleEndDataChange(e, data)}
		       value={pendss}
		/>
	      </Form.Field>
	      <Form.Field width={1}>
		<Button onClick={this._resetEnd.bind(this)}
			content='Reset'
		/>
	      </Form.Field>
	    </Form.Group>

	    <Form.Group widths='equal'>
	      <Form.Field width={1}>
		<label> Hints taken </label>
		<Container> {hintsTaken} </Container>
	      </Form.Field>
	      <Form.Field width={1}>
		<label> Update </label>
		<Container> {hintsEdit} </Container>
	      </Form.Field>
	      <Form.Field width={1}>
		<Button onClick={this._resetHints.bind(this)}
			content='Reset'
		/>
	      </Form.Field>
	    </Form.Group>
	    
	    <Form.Group>
	      <Form.Field width={3}>
		<label> Timed out </label>
		<Container> <Icon key='timeOut' name={timedOut} /> </Container>
	      </Form.Field>
	      <Form.Field width={4}>
		<label> Update </label>
		<Container> <Icon key='timeOut' name={editTimedOut} /> </Container>
	      </Form.Field>
	    </Form.Group>
	    <Form.Group>
	      <Form.Field width={3}>
		<label> Score </label>
		<Container> {puzzle.score} </Container>
	      </Form.Field>
	      <Form.Field width={4}>
		<label> Updated score </label>
		<Container> {this.state.score} </Container>
	      </Form.Field>
	    </Form.Group>
	  </Form>
        </Modal.Content>
	
	<Modal.Actions>
	  <Button
	    color='green'
	    content='Save'
	  />
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

  _handleStartDataChange(e, data) {
    const { name } = data;
    console.log("field ", name, " changed to ", data);

    console.log('hsdc: edit puzzle before: ', this.editPuzzle);
    let startEdit = moment(this.state.start);
    let hhErr = false;
    let mmErr = false;
    let ssErr = false;
    if (name == 'start-hh') {
      if ((data.value < 0) || (data.value > 23)) {
	console.log('start hours out of range');
	hhErr = true
      } else {
	startEdit.hour(data.value);
      }
    } else if (name == 'start-mm') {
      if ((data.value < 0) || (data.value > 59)) {
	console.log('start minutes out of range');
	mmErr = true
      } else {
	startEdit.minute(data.value);
      }
    } else if (name == 'start-ss') {
      if ((data.value < 0) || (data.value > 59)) {
	console.log('start seconds out of range');
	ssErr = true;
      } else {
	startEdit.second(data.value);
      }
    }
    console.log('hsdc: start edit: ', startEdit);
    this.editPuzzle.start = startEdit.toDate();
    console.log('hsdc: edit puzzle after: ', this.editPuzzle);
    this.setState({ start: startEdit.toDate(),
		    startHHError: hhErr,
		    startMMError: mmErr,
		    startSSError: ssErr
		  });
    this._recalculateScore();
  }

  _handleEndDataChange(e, data) {
    const { name } = data;
    console.log("field ", name, " changed to ", data);

    let endEdit = moment(this.editPuzzle.end);
    let hhErr = false;
    let mmErr = false;
    let ssErr = false;
    if (name == 'end-hh') {
      if ((data.value < 0) || (data.value > 23)) {
	console.log('end hours out of range');
	hhErr = true
      } else {
	endEdit.hour(data.value);
      }
    } else if (name == 'end-mm') {
      if ((data.value < 0) || (data.value > 59)) {
	console.log('start minutes out of range');
	mmErr = true
      } else {
	endEdit.minute(data.value);
      }
    } else if (name == 'end-ss') {
      if ((data.value < 0) || (data.value > 59)) {
	console.log('start seconds out of range');
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
    this._recalculateScore();
  }

  _handleCheckChange(e, data) {
    const { name } = data;
    console.log('checkbox ', name, ' changed to ', data);
    const oldHints = this.editPuzzle.hints;
    let newHints = [];
    // update the hints by looping so that there is no dependency on
    // the number of hints involved, as opposed to trying to compute
    // an indenx into the array
    oldHints.forEach((hint, index) => {
      const boxname = 'hint' + index;
      if (boxname === name) {
	console.log('found name: ', name);
	newHints.push({...hint, taken: data.checked});
      } else {
	newHints.push(hint);
      }
    });
    console.log('new hints: ', newHints);
    this.editPuzzle.hints = newHints;
    this.setState({ hints: newHints });
    this._recalculateScore();
  }

  _recalculateScore() {
    console.log('recalculating score');
    console.log('edit puzzle: ', this.editPuzzle);

    this.setState( { startEndOrderError: (this.editPuzzle.start >= this.editPuzzle.end) });

    Meteor.call('admin.team.computeScore', this.editPuzzle,
		(err, res) => {
		  if (err) {
		    console.log('recalculate score error');
		    console.log(err);
		  } else {
		    console.log('compute score reply: ', res);
		    const [newTimeout, newScore] = res;
		    console.log('new score got: ', newScore);
		    console.log('new timeout got: ', newTimeout);
		    this.editPuzzle.score = newScore;
		    this.editPuzzle.timedOut = newTimeout;
		    // const n = Date.now();
		    // const ns = n.toString();
		    // console.log('date string: ', ns);
		    this.setState({ score: newScore, timedOut: newTimeout });
		  }
		});
  }

  _resetStart() {
    console.log('reset start time');
    this.editPuzzle.start = this.props.puzzle.start;
    this.setState({ start: this.props.puzzle.start,
		    startHHError: false,
		    startMMError: false,
		    startSSError: false
		  });
    this._recalculateScore();
  }

  _resetEnd() {
    console.log('reset end time');
    this.editPuzzle.end = this.props.puzzle.end;
    this.setState({ end: this.props.puzzle.end,
		    endHHError: false,
		    endMMError: false,
		    endSSError: false
		  });
    this._recalculateScore();
  }

  _resetHints() {
    console.log('reset hints');
    this.editPuzzle.hints = this.props.puzzle.hints;
    this.setState({ hints: this.props.puzzle.hints });
    this._recalculateScore();
  }
}

AdminTeamPuzzleEdit.propTypes = {
  team: PropTypes.object,
  puzzle: PropTypes.object,
  clearPuzzle: PropTypes.func.isRequired,
};

export default AdminTeamPuzzleEdit;
