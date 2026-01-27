import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Form, Message, Header } from 'semantic-ui-react';
import { omit } from 'lodash';

class CheckpointEditor extends Component {
  constructor(props) {
    super(props);
    this.state = this._stateFromProps(props);
  }

  _stateFromProps(props) {
    const { checkpoint } = props;
    return omit(checkpoint, ['_id']);
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

  _textMultilineInput(name, label) {
    return (
      <Form.TextArea
        name={name}
        label={label}
        error={ this.state[name] ? false : 'Empty!' }
        value={ this.state[name] }
        onChange={ (e) => this._handleChange(e) }
      />
    );
  }

  _textOrBlankInput(name, label) {
    return (
      <Form.Input
        name={name}
        label={label}
        error={ false }
        value={ this.state[name] }
        onChange={ (e) => this._handleChange(e) }
      />
    );
  }

  _booleanInput(name, label) {
    const value = this.state[name];
    return (
      <Form.Checkbox
	name = { name }
	label = { label }
	checked = { value }
	onChange = { (e) => this._handleBoolChange(e) }
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
        <Header as='h3' content='Checkpoint Editor'/>
        <Form.Group inline>
          { this._textInput("name", "Checkpoint Name") }
        </Form.Group>

        <Form.Group widths='equal'>
          { this._numericalInput("sequence", "Sequence") }
        </Form.Group>

        { this._textMultilineInput("startDescription", "Description of start") }
	{ this._textMultilineInput("codewordLabel", "Label for codeword entry") }
        { this._textMultilineInput("finishDescription", "Message on finishing") }

	{ this._booleanInput("hasCodeword", "Has codeword?") }
        { this._textOrBlankInput("codeword", "Codeword") }
      
        <Form.Group>
          <Form.Button color='green' content='Save'
                       onClick={async (e) => await this._save(e)}/>
          <Form.Button basic content='Close' onClick={this.props.closeCheckpoint}/>
        </Form.Group>

      </Form>
    );
  }

  async _save(e) {
    e.preventDefault();
    const { name, sequence, startDescription, codewordLabel,
	    finishDescription, 
            codeword, hasCodeword } = this.state;
    const nonCharacterDigit = /[^a-zA-Z0-9]/ug
    const fields = {
      name: name.trim(),
      sequence: parseInt(sequence),
      startDescription: startDescription.trim(),
      codewordLabel: codewordLabel.trim(),
      finishDescription: finishDescription.trim(),
      codeword: codeword.trim(),
      hasCodeword: hasCodeword
    };

    try {
      await Meteor.callAsync('admin.thcheckpoints.update', this.props.checkpoint._id, fields);
      alert(`"${fields.name}" saved!`);
    } catch (error) {
      alert(error.reason);
    }
  }

  _handleChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  _handleBoolChange(e) {
    const curr = this.state.hasCodeword;
    this.setState({ hasCodeword: !curr });
  }
}

CheckpointEditor.propTypes = {
  checkpoint: PropTypes.object.isRequired,
  closeCheckpoint: PropTypes.func.isRequired,
};

export default CheckpointEditor;
