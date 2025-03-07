import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Header, Label, Button, Icon, Popup, List, } from 'semantic-ui-react';

import puzzleTracker from './PuzzleTracker';

const stagesColors = ['green', 'blue', 'orange', 'red'];

class PuzzleList extends Component {
  render() {
    return (
      <Grid stackable>
        { this._actions() }
        { this._puzzles() }
      </Grid>
    );
  }

  _actions() {
    return (
      <Grid.Row columns='1'>
        <Grid.Column>
          <Header as='h3' content='Puzzles'/>
          <Button basic size='small' content='New Puzzle'
                  onClick={async () => await this._createPuzzle() }/>
        </Grid.Column>
      </Grid.Row>
    );
  }

  async _createPuzzle() {
    try {
      await Meteor.callAsync('admin.puzzle.create');
    } catch (error) {
      alert(error.reason);
    }
  }

  _puzzles() {
    const { puzzles, activePuzzle } = this.props;
    const activePuzzleId = activePuzzle ? activePuzzle._id : null;
    return puzzles.map((puzzle) => this._puzzle(puzzle, activePuzzleId));
  }

  _validation(issues) {
    if (!issues || issues.length === 0) {
      return;
    }

    let content = <List>
                    {issues.map((issue, index) => <List.Item key={index}>{issue}</List.Item> )}
                  </List>;

    return (
      <Popup content={content} trigger={<Icon name='exclamation' />} />
    );
  }

  _puzzle(puzzle, activePuzzleId) {
    const isActive = puzzle._id === activePuzzleId;
    let issues = [];
    const text_fields = ["name", "answer"];
    const num_fields = ["stage", "allowedTime", "timeoutScore",  "bonusTime"];
    text_fields.forEach(field => {
      if (puzzle[field] === '') {
        issues.push(`Invalid value for ${field}`);
      }
    });
    num_fields.forEach(field => {
      if (puzzle[field] === '' || puzzle[field] < 0 || isNaN(puzzle[field])) {
        issues.push(`Invalid value for ${field}`);
      }
    });
    puzzle.hints.forEach((hint, i) => {
      if (!hint.imageUrl && !hint.text) {
        issues.push(`Hint ${i} empty or missing data`);
      }
    });

    return (
      <Grid.Row columns={5} name={ puzzle._id} key={ puzzle._id } color={isActive ? "teal" : undefined}>
        <Grid.Column>
          <Label color={ stagesColors[puzzle.stage] } content={ puzzle.stage }/>&nbsp; { puzzle.name }
        </Grid.Column>
        <Grid.Column>
          {puzzle.allowedTime} allowed
        </Grid.Column>
        <Grid.Column>
          {puzzle.bonusTime} bonus
        </Grid.Column>
        <Grid.Column>
          {puzzle.timeoutScore} timeout score
        </Grid.Column>
        <Grid.Column>
          { this._validation(issues) }
          <Button basic floated='right'
            icon='trash'
            onClick={ () => this._delete(puzzle) }
          />
          <Button basic floated='right'
            content='Edit'
            color='green'
            onClick={ () => this._edit(puzzle) }
          />
        </Grid.Column>
      </Grid.Row>
    );
  }

  _edit(puzzle) {
    this.props.onEdit(puzzle);
  }

  _delete(puzzle) {
    this.props.onDelete(puzzle);
  }
}

PuzzleList.propTypes = {
  puzzles: PropTypes.array.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default puzzleTracker(PuzzleList);
