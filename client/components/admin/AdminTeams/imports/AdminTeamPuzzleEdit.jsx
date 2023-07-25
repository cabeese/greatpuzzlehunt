import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Container, Form, Icon, Input, Modal, Tab } from 'semantic-ui-react';
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

    if (puzzle.start) {
      const pstart = moment(puzzle.start);
      const pstarttext = pstart.format("HH:mm:ss");
      const pstarthh = pstart.hour();
      const pstartmm = pstart.minute();
      const pstartss = pstart.second();
    } else {
      const pstart = null;
      const pstarttext = '--';
      const pstarthh = '0';
      const pstartmm = '0';
      const pstartss = '0';
    }

    if (puzzle.end) {
      const pend = moment(puzzle.end);
      const pendtext = pend.format("HH:mm:ss");
      const pendhh = pend.hour();
      const pendmm = pend.minute();
      const pendss = pend.second();
    } else {
      const pend = null;
      const pendtext = '--';
      const pendhh = '0';
      const pendmm = '0';
      const pendss = '0';
    }
    
    return (
      <Modal
        size="large"
        open={true}
        closeIcon={true}
        onClose={() => clearPuzzle() }
      >
        <Modal.Header>{team.name}: {puzzle.name}</Modal.Header>
	
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
		<Input readOnly />
	      </Form.Field>
	      <Form.Field width={1}>
		<label> hh </label>
		<Input />
	      </Form.Field>
	      <Form.Field width={1}>
		<label> mm </label>
		<Input />
	      </Form.Field>
	      <Form.Field width={1}>
		<label> ss </label>
		<Input />
	      </Form.Field>
	    </Form.Group>
	    <Form.Group widths='equal'>
	      <Form.Field width={4}>
		<label> Hints taken </label>
		<Container> text here </Container>
	      </Form.Field>
	      <Form.Input label='Update' />
	    </Form.Group>
	    <Form.Group>
	      <Form.Field width={4}>
		<label> Timed out </label>
		<Container> {puzzle.timedOut ? 'true' : 'false'} </Container>
	      </Form.Field>
	      <Form.Field width={4}>
		<label> update </label>
		<Container> -- </Container>
	      </Form.Field>
	    </Form.Group>
	    <Form.Group>
	      <Form.Field width={4}>
		<label> Score </label>
		<Container> {puzzle.score} </Container>
	      </Form.Field>
	      <Form.Field width={4}>
		<label> update </label>
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
}

AdminTeamPuzzleEdit.propTypes = {
  team: PropTypes.object,
  puzzle: PropTypes.object,
  clearPuzzle: PropTypes.func.isRequired,
};

export default AdminTeamPuzzleEdit;
