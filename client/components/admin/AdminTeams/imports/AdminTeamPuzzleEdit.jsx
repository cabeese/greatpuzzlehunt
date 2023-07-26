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
    this.state = { selectedPuzzleId: '' };
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
    console.log("ATPE render actually rendering");

    let pstart = null;
    let pstarttext = '--';
    let pstarthh = '0';
    let pstartmm = '0';
    let pstartss = '0';
    if (puzzle.start) {
      pstart = moment(puzzle.start);
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
    if (puzzle.end) {
      pend = moment(puzzle.end);
      pendtext = pend.format("HH:mm:ss");
      pendhh = pend.hour();
      pendmm = pend.minute();
      pendss = pend.second();
    }

    let hintsTaken = [];
    let hintsEdit = [];
    puzzle.hints.forEach((hint, index) => {
      const name = hint.taken? 'check square' : 'square outline';
      hintsTaken.push(<Icon key={index} name={name} />);
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
	      <Form.Field width={4}>
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
	    </Form.Group>

	    <Form.Group>
	      <Form.Field width={4}>
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
	    </Form.Group>
	    
	    <Form.Group>
	      <Form.Field width={4}>
		<label> Timed out </label>
		<Container> <Icon key='timeOut' name={timedOut} /> </Container>
	      </Form.Field>
	      <Form.Field width={4}>
		<label> New result </label>
		<Container> -- </Container>
	      </Form.Field>
	    </Form.Group>
	    <Form.Group>
	      <Form.Field width={4}>
		<label> Score </label>
		<Container> {puzzle.score} </Container>
	      </Form.Field>
	      <Form.Field width={4}>
		<label> New result </label>
		<Container> -- </Container>
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
  }

  _handleCheckChange(e, data) {
    const { name, value } = data;
    console.log('checkbox ', name, ' changed to ', data);
  }
}

AdminTeamPuzzleEdit.propTypes = {
  team: PropTypes.object,
  puzzle: PropTypes.object,
  clearPuzzle: PropTypes.func.isRequired,
};

export default AdminTeamPuzzleEdit;
