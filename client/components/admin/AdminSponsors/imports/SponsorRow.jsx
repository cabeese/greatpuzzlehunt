import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { pick } from 'lodash';
import Dropzone from 'react-dropzone';
import { debounce } from 'lodash';

import {
  Form,
  Grid,
  Icon,
  Image,
  Button,
  Message,
  Confirm,
} from 'semantic-ui-react';

const dropZoneStyle = {
  cursor: "pointer",
  marginLeft: ".5em",
};

const levelOptions = [
  { key: 'puzzlemaster', value: 'puzzlemaster', text: 'Puzzle Master ($2000+)' },
  { key: 'cipher', value: 'cipher', text: 'Cipher ($1000-$1999)' },
  { key: 'crossword', value: 'crossword', text: 'Crossword ($500-$999)' },
  { key: 'jigsaw', value: 'jigsaw', text: 'Jigsaw ($200-$499)' },
];

class SponsorRow extends Component {
  constructor(props) {
    super(props);
    this.state = this._stateFromprops(props);

    this.debouncedSave = debounce(() => this._save(), 500, { trailing: true });
  }

  _stateFromprops(props) {
    const { _id, name, level, publish, logoUrl, imageId } = props.sponsor;
    return {
      _id,
      name,
      level,
      publish,
      message: null,
      logoUrl: logoUrl || "https://react.semantic-ui.com/images/avatar/large/matthew.png",
      imageId,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState(this._stateFromprops(nextProps));
  }

  render () {
    const { _id, name, level, publish, logoUrl } = this.state;
    return (
      <Grid.Row columns={2}>
        <Grid.Column width={4}>
          <Image src={logoUrl}/>
        </Grid.Column>
        <Grid.Column width={12}>
          <Form onSubmit={(e) => e.preventDefault()}>
            <Form.Group>
              <Form.Input name="name" label='Sponsor (Not Public)' placeholder='Cool Company' value={this.state.name} onChange={ (e) => this._handleTextChange(e) } width={12}/>
              <Form.Dropdown name='level' label='Donor Level' placeholder='Donor Level' selection options={levelOptions} value={ this.state.level } onChange={ (e, data) => this._handleDataChange(e, data) }/>
            </Form.Group>

            <p></p> {/* For mobile spacing */}

            <Form.Group>
              Image URL: <input name='logoURL' value={logoUrl}  type="text" onChange={(e) => this._onUrlChange(e.target.value) }/>

              <Form.Checkbox toggle
                name='publish'
                label="Publish on Homepage"
                defaultChecked={this.state.publish}
                onChange={ (e,data) => this._handleDataChange(e,data) } />

              <Form.Button floated="right" content="Delete" icon={<Icon name="trash"/>} basic color='red' onClick={(e) => this.setState({ confirming: true })}/>
            </Form.Group>
          </Form>

          <Confirm
            open={this.state.confirming}
            onCancel={() => this.setState({ confirming: false })}
            onConfirm={() => this._delete()}
            content={`Are you sure you want to remove ${this.state.name}?`}/>

          { this.state.message ? this._message() : null}
        </Grid.Column>
      </Grid.Row>
    );
  }

  async _onUrlChange(value) {
    await this._save();

    const data = {
      sponsorId: this.props.sponsor._id,
      imageUrl: value,
    };

    try {
      await Meteor.callAsync('sponsors.updateImage', data);
    } catch(error) {
      alert(error.reason);
    }
  }

  _handleTextChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
    this.debouncedSave();
  }

  _handleDataChange(e, data) {
    const { name, value, checked } = data;
    this.setState({ [name]: (value || checked) });

    this.debouncedSave();
  }

  async _save() {
    const data = pick(this.state, ['_id', 'name', 'level', 'publish']);
    try {
      await Meteor.callAsync('sponsors.update', data);
      this.setState({ message: "Saved" });
      Meteor.setTimeout(() => this._clearMessage(), 1000);
    } catch (error) {
      alert(error.reason);
      return;
    }
  }

  async _delete(e) {
    this.setState({confirming: false});
    try {
      await Meteor.callAsync('sponsors.remove', this.props.sponsor._id);
    } catch(error) {
      alert(error.reason);
    }
  }

  _message() {
    const { message } = this.state;
    return (
      <Message positive content={this.state.message}/>
    );
  }

  _clearMessage() {
    this.setState({ message: null });
  }
}

SponsorRow.propTypes = {
  sponsor: PropTypes.object,
};

export default SponsorRow;
