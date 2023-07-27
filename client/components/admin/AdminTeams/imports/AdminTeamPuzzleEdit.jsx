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
    this.state = { setup: false };
  }
  // constructor(props) {
  //   super(props);
  //   // this.state = props.puzzle;
  //   this.state = {x: 'y'};
  // }

  _setupState() {
    console.log('in ATPE setup state');
    console.log('puzzle: ', this.props.puzzle);
    this.setState({ setup: true, ...this.props.puzzle});
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
    if (!this.state.setup) {
      this._setupState();
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

    let startEdit = moment(this.state.start);
    if (name == 'start-hh') {
      startEdit.hour(data.value);
    } else if (name == 'start-mm') {
      startEdit.minute(data.value);
    } else if (name == 'start-ss') {
      startEdit.second(data.value);
    }
    this.setState({start: startEdit.toDate()});
    this._recalculateScore();
  }

  _handleEndDataChange(e, data) {
    const { name } = data;
    console.log("field ", name, " changed to ", data);

    let endEdit = moment(this.state.end);
    if (name == 'end-hh') {
      endEdit.hour(data.value);
    } else if (name == 'end-mm') {
      endEdit.minute(data.value);
    } else if (name == 'end-ss') {
      endEdit.second(data.value);
    }
    this.setState({end: endEdit.toDate()});
    this._recalculateScore();
  }

  _handleCheckChange(e, data) {
    const { name } = data;
    console.log('checkbox ', name, ' changed to ', data);
    const oldHints = this.state.hints;
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
    this.setState({ hints: newHints });
    this._recalculateScore();
  }

  // XXX need to adjust timed out as well
  _recalculateScore() {
    console.log('recalculating score');
    const newScore = this.state.score + 2;
    this.setState({ score: newScore });

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
    this.setState({ start: this.props.puzzle.start });
    this._recalculateScore();
  }

  _resetEnd() {
    this.setState({ end: this.props.puzzle.end });
    this._recalculateScore();
  }

  _resetHints() {
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
