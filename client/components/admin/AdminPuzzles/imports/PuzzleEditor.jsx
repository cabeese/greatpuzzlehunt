import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Form, Message, Header } from 'semantic-ui-react';
import { omit } from 'lodash';

import HintEditor from './HintEditor';

class PuzzleEditor extends Component {
  constructor(props) {
    super(props);
    this.state = this._stateFromProps(props);
  }

  _stateFromProps(props) {
    const { puzzle } = props;
    return omit(puzzle, ['_id']);
  }

  _textInput(name, label) {
    return (
      <Form.Input
        name={name}
        label={label}
        error={ this.state[name] ? false : 'Empty!' }
        value={ this.state[name] }
        onChange={ (e) => this._handleChange(e) }
      />
    );
  }

  _numericalInput(name, label) {
    const value = this.state[name];
    const isError = isNaN(parseInt(value, 10)) ||
          String(value) !== String(parseInt(value, 10));
    return (
      <Form.Input
        name={name}
        label={label}
        error={ isError ? "Fishy value..." : false }
        value={ value }
        onChange={ (e) => this._handleChange(e) }
      />
    );
  }

  render() {
    return (
      <Form onSubmit={(e) => e.preventDefault() }>
        <Header as='h3' content='Puzzle Editor'/>
        <Form.Group inline>
          { this._textInput("name", "Puzzle Name") }
          { this._textInput("answer", "Answer") }
        </Form.Group>

        <small>Note: 'stage' should be 0 for the four main puzzles and 1 (or higher) for Meta puzzle ONLY.</small>
        <Form.Group widths='equal'>
          { this._numericalInput("stage", "Stage") }
          { this._numericalInput("allowedTime", "Time Allowed (min)") }
          { this._numericalInput("timeoutScore", "Timeout Score (min)") }
          { this._numericalInput("bonusTime", "Bonus Time (min)") }
        </Form.Group>

        { this._textInput("location", "Location (in-person only)") }
        { this._textInput("downloadURL", "Download URL (virtual only)") }

        <HintEditor hints={this.state.hints} updateHints={(hints) => this.setState({ hints })}/>

        <Message size="tiny">
          In some cases, we may know of a wrong answer that teams may be
          likely to guess. If they do, we can provide them with a free hint
          that directs them back to the right path.
          If a team guesses any of the "trigger codewords," they will be
          given the "trigger hint" for free.
        </Message>
        <Form.Group>
          <Form.Input
            name="triggerCodewords"
            label="Trigger codeword(s) [optional]"
            placeholder="soclose,almostthere"
            value={this.state.triggerCodewords}
            onChange={ (e) => this._handleChange(e) }
            />

          <Form.Input
            name="triggerHintImageURL"
            label="Trigger Hint image URL [optional]"
            value={this.state.triggerHintImageURL}
            onChange={ (e) => this._handleChange(e) }
            />
        </Form.Group>

        <Form.Group>
          <Form.Button color='green' content='Save' onClick={(e) => this._save(e)}/>
          <Form.Button basic content='Close' onClick={this.props.closePuzzle}/>
        </Form.Group>

      </Form>
    );
  }

  _save(e) {
    e.preventDefault();
    const { name, stage, answer, allowedTime, timeoutScore,
            bonusTime, location, downloadURL, hints,
            triggerCodewords, triggerHintImageURL } = this.state;
    const nonCharacterDigit = /[^a-zA-Z0-9]/ug
    const fields = {
      name: name.trim(),
      stage: parseInt(stage),
      allowedTime: parseInt(allowedTime),
      timeoutScore: parseInt(timeoutScore),
      bonusTime: parseInt(bonusTime),
      answer: answer.replaceAll(nonCharacterDigit, '').toLowerCase(),
      location: location.trim(),
      downloadURL: downloadURL.trim(),
      hints,
      triggerCodewords: triggerCodewords.trim(),
      triggerHintImageURL: triggerHintImageURL.trim(),
    };

    Meteor.call('admin.puzzle.update', this.props.puzzle._id, fields, (error, result) => {
      if (error) return alert(error.reason);
      alert(`"${fields.name}" saved!`)
    });
  }

  _handleChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }
}

PuzzleEditor.propTypes = {
  puzzle: PropTypes.object.isRequired,
  closePuzzle: PropTypes.func.isRequired,
};

export default PuzzleEditor;
