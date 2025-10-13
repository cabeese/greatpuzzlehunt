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

        { this._textInput("startDescription", "Description of start") }
        { this._textInput("finishDescription", "Message on finishing") }

        { this._textOrBlankInput("cw0", "Codeword 0") }
        { this._textOrBlankInput("cw1", "Codeword 1") }
        { this._textOrBlankInput("cw2", "Codeword 2") }
        { this._textOrBlankInput("cw3", "Codeword 3") }
        { this._textOrBlankInput("cw4", "Codeword 4") }
      
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
    const { name, sequence, startDescription, finishDescription, 
            cw0, cw1, cw2, cw3, cw4 } = this.state;
    const nonCharacterDigit = /[^a-zA-Z0-9]/ug
    const fields = {
      name: name.trim(),
      sequence: parseInt(sequence),
      startDescription: startDescription.trim(),
      finishDescription: finishDescription.trim(),
      cw0: cw0.trim(),
      cw1: cw1.trim(),
      cw2: cw2.trim(),
      cw3: cw3.trim(),
      cw4: cw4.trim(),
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
}

CheckpointEditor.propTypes = {
  checkpoint: PropTypes.object.isRequired,
  closeCheckpoint: PropTypes.func.isRequired,
};

export default CheckpointEditor;
