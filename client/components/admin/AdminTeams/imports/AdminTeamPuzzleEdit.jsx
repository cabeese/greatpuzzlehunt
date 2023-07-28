import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Checkbox, Container, Form, Icon,
	 Input, Modal, Tab } from 'semantic-ui-react';
import { getPuzzleScore } from '../../../../../lib/imports/puzzle-helpers';
import moment from 'moment';

class AdminTeamPuzzleEdit extends Component {
  constructor(props) {
    super(props);
    // state is the react-observable information that will trigger
    // re-rendering; however, all actual computations are done using
    // independent state that can be known to be synchronously up to
    // date, and the state variable is updated separately
    this.state = { last: '--' };

    // independent information is in editPuzzle
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
      // this.editPuzzle = this.props.puzzle;
      console.log("set edit puzzle: ", this.editPuzzle);
    }
    // if (!this.setup) {
    //   this._setupState();
    //   return null;
    // }
    console.log("ATPE render actually rendering");

    let pstart = null;
    let pstarttext = '--';
    let pstarthh = '0';
    let pstartmm = '0';
    let pstartss = '0';
    if (puzzle.start) {
      pstarttext = moment(puzzle.start).format("HH:mm:ss");
    }
    if (this.editPuzzle.start) {
      pstart = moment(this.editPuzzle.start);
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
    if (this.editPuzzle.end) {
      pend = moment(this.editPuzzle.end);
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
    this.editPuzzle.hints.forEach((hint, index) => {
      const boxname = 'hint' + index;
      hintsEdit.push(<Checkbox name={boxname}
			       onChange={(e, data) => this._handleCheckChange(e, data)}
			       checked={hint.taken}
		     />);
    });
    console.log('set up hints edit: ', hintsEdit);

    const timedOut = puzzle.timedOut ? 'check square' : 'square outline' ;
    console.log('set up timed out');
    const editTimedOut = this.editPuzzle.timedOut ? 'check square' : 'square outline' ;
    console.log('set up timed out edit');
    
    return (
      <Modal
        size="large"
        open={true}
        closeIcon={true}
        onClose={() => clearPuzzle() }
      >
        <Modal.Header>Edit times for {team.name}: {puzzle.name}</Modal.Header>
	
        <Modal.Content>
	  <Form>

	    <Form.Group>
	      <Form.Field width={3}>
		<label> Start </label>
		<Container> {pstarttext} </Container>
	      </Form.Field>
	      <Form.Field width={1}>
		<label> hh </label>
		<Input name='start-hh'
                       onChange={(e, data) => this._handleStartDataChange(e, data)}
		       value={pstarthh}
		/>
	      </Form.Field>
	      <Form.Field width={1}>
		<label> mm </label>
		<Input name='start-mm'
                       onChange={(e, data) => this._handleStartDataChange(e, data)}
		       value={pstartmm}
		/>
	      </Form.Field>
	      <Form.Field width={1}>
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
	      <Form.Field width={1}>
		<label> hh </label>
		<Input name='end-hh'
                       onChange={(e, data) => this._handleEndDataChange(e, data)}
		       defaultValue={pendhh}
		/>
	      </Form.Field>
	      <Form.Field width={1}>
		<label> mm </label>
		<Input name='end-mm'
                       onChange={(e, data) => this._handleEndDataChange(e, data)}
		       defaultValue={pendmm}
		/>
	      </Form.Field>
	      <Form.Field width={1}>
		<label> ss </label>
		<Input name='end-ss'
                       onChange={(e, data) => this._handleEndDataChange(e, data)}
		       defaultValue={pendss}
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
		<label> New result </label>
		<Container> <Icon key='timeOut' name={editTimedOut} /> </Container>
	      </Form.Field>
	    </Form.Group>
	    <Form.Group>
	      <Form.Field width={3}>
		<label> Score </label>
		<Container> {puzzle.score} </Container>
	      </Form.Field>
	      <Form.Field width={4}>
		<label> New result </label>
		<Container> {this.editPuzzle.score} </Container>
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
    let startEdit = moment(this.editPuzzle.start);
    if (name == 'start-hh') {
      startEdit.hour(data.value);
    } else if (name == 'start-mm') {
      startEdit.minute(data.value);
    } else if (name == 'start-ss') {
      startEdit.second(data.value);
    }
    console.log('hsdc: start edit: ', startEdit);
    this.editPuzzle.start = startEdit.toDate();
    console.log('hsdc: edit puzzle after: ', this.editPuzzle);
    // this.setState({start: startEdit.toDate()});
    this._recalculateScore();
  }

  _handleEndDataChange(e, data) {
    const { name } = data;
    console.log("field ", name, " changed to ", data);

    let endEdit = moment(this.editPuzzle.end);
    if (name == 'end-hh') {
      endEdit.hour(data.value);
    } else if (name == 'end-mm') {
      endEdit.minute(data.value);
    } else if (name == 'end-ss') {
      endEdit.second(data.value);
    }
    this.editPuzzle.end = endEdit.toDate();
    // this.setState({end: endEdit.toDate()});
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
    // this.setState({ hints: newHints });
    this._recalculateScore();
  }

  // XXX need to adjust timed out as well

  // XXX doesn't seem to pick up the last data change from updating
  // the field
  _recalculateScore() {
    console.log('recalculating score');
    // const newScore = this.state.score + 2;
    // this.setState({ score: newScore });
    console.log('edit puzzle: ', this.editPuzzle);

    Meteor.call('admin.team.computeScore', this.editPuzzle,
		(err, res) => {
		  if (err) {
		    console.log('recalculate score error');
		    console.log(err);
		  } else {
		    console.log('new score got: ', res);
		    this.editPuzzle.score = res;
		    const n = Date.now();
		    const ns = n.toString();
		    console.log('date string: ', ns);
		    this.setState({ last: ns });
		  }
		});

    console.log('out of method call');

    // this does not work on client side because puzzle collection
    // is not present (and shouldn't be)
    
    // const { puzzleId } = this.props.puzzle;
    // console.log("puzzle id: ", puzzleId);
    // const masterPuzzle = Puzzles.findOne(puzzleId);
    // console.log("master puzzle: ", masterPuzzle);
    // const endTime = this.state.end;
    // console.log("end time: ", endTime);
    // const editScore = getPuzzleScore(this.state, endTime, masterPuzzle, false);
    // console.log("edit score: ", editScore);
    // this.setState({ score: editScore });
  }

  _resetStart() {
    this.editPuzzle.start = this.props.puzzle.start;
    // this.setState({ start: this.props.puzzle.start });
    this._recalculateScore();
  }

  _resetEnd() {
    this.editPuzzle.end = this.props.puzzle.end;
    // this.setState({ end: this.props.puzzle.end });
    this._recalculateScore();
  }

  _resetHints() {
    this.editPuzzle.hints = this.props.puzzle.hints;
    //this.setState({ hints: this.props.puzzle.hints });
    this._recalculateScore();
  }
}

AdminTeamPuzzleEdit.propTypes = {
  team: PropTypes.object,
  puzzle: PropTypes.object,
  clearPuzzle: PropTypes.func.isRequired,
};

export default AdminTeamPuzzleEdit;
