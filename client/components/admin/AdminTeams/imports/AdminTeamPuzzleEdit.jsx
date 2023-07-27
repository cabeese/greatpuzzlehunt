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
    if (this.state.start) {
      pstart = moment(this.state.start);
      pstarttext = pstart.format("HH:mm:ss");
      pstarthh = pstart.hour();
      pstartmm = pstart.minute();
      pstartss = pstart.second();
    }
    
    let pend = null;
    let pendtext = '--';
    let pendhh = '0';
    let pendmm = '0';
    let pendss = '0';
    if (this.state.end) {
      pend = moment(this.state.end);
      pendtext = pend.format("HH:mm:ss");
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
      if (hint.taken) {
	hintsEdit.push(<Checkbox name={boxname}
				 onChange={(e, data) => this._handleCheckChange(e, data)}
				 defaultChecked
		       />);
      } else {
	hintsEdit.push(<Checkbox name={boxname}
				 onChange={(e, data) => this._handleCheckChange(e, data)}
		       />);
      }
    });

    const timedOut = puzzle.timedOut ? 'check square' : 'square outline' ;
    const editTimedOut = this.state.timedOut ? 'check square' : 'square outline' ;
    
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
                       onChange={(e, data) => this._handleDataChange(e, data)}
		       defaultValue={pstarthh}
		/>
	      </Form.Field>
	      <Form.Field width={1}>
		<label> mm </label>
		<Input name='start-mm'
                       onChange={(e, data) => this._handleDataChange(e, data)}
		       defaultValue={pstartmm}
		/>
	      </Form.Field>
	      <Form.Field width={1}>
		<label> ss </label>
		<Input name='start-ss'
                       onChange={(e, data) => this._handleDataChange(e, data)}
		       defaultValue={pstartss}
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
                       onChange={(e, data) => this._handleDataChange(e, data)}
		       defaultValue={pendhh}
		/>
	      </Form.Field>
	      <Form.Field width={1}>
		<label> mm </label>
		<Input name='end-mm'
                       onChange={(e, data) => this._handleDataChange(e, data)}
		       defaultValue={pendmm}
		/>
	      </Form.Field>
	      <Form.Field width={1}>
		<label> ss </label>
		<Input name='end-ss'
                       onChange={(e, data) => this._handleDataChange(e, data)}
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

  _handleDataChange(e, data) {
    const { name, value } = data;
    console.log("field ", name, " changed to ", data);
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
    // const newScore = this.state.score + 2;
    // this.setState({ score: newScore });

    const { puzzleId } = this.props.puzzle;
    console.log("puzzle id: ", puzzleId);
    const masterPuzzle = Puzzles.findOne(puzzleId);
    console.log("master puzzle: ", masterPuzzle);
    const endTime = this.state.end;
    console.log("end time: ", endTime);
    const editScore = getPuzzleScore(this.state, endTime, masterPuzzle, false);
    console.log("edit score: ", editScore);
    this.setState({ score: editScore });
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
