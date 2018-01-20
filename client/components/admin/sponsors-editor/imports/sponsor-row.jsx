import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { pick } from 'lodash';
import Dropzone from 'react-dropzone';

import {
  Form,
  Grid,
  Icon,
  Image,
  Button,
} from 'semantic-ui-react';

const dropZoneStyle = {
  cursor: "pointer",
  marginLeft: ".5em",
};

class SponsorRow extends Component {
  constructor(props) {
    super(props);
    const { _id, name, amount, publish, logoUrl, imageId } = props.sponsor;
    this.state = {
      _id,
      name,
      amount,
      publish,
      logoUrl: logoUrl || "https://react.semantic-ui.com/assets/images/avatar/large/matthew.png",
    };
  }

  render () {
    const { _id, name, amount, publish, logoUrl } = this.state;
    return (
      <Grid.Row columns={2}>
        <Grid.Column width={4}>
          <Image src={logoUrl}/>
        </Grid.Column>
        <Grid.Column width={12}>
          <Form onSubmit={(e) => e.preventDefault()}>
            <Form.Group>
              <Form.Input name="name" label='Sponsor Name' placeholder='Cool Company' value={this.state.name} onChange={ (e) => this._handleTextChange(e) } width={12}/>
              <Form.Input name='amount' label='Donation Amount' placeholder='$500' value={this.state.amount} onChange={ (e) => this._handleTextChange(e) } width={4}/>
            </Form.Group>

            <p></p> {/* For mobile spacing */}

            <Form.Group>
              <Dropzone name='logoUpload' className="ui basic button" disablePreview style={dropZoneStyle} accept='image/*' multiple={false} onDrop={(files) => this._onDrop(files)}>
                Upload Logo
              </Dropzone>

              <Form.Checkbox toggle
                name='publish'
                label="Publish on Homepage"
                defaultChecked={this.state.publish}
                onChange={ (e,data) => this._handleDataChange(e,data) } />
            </Form.Group>

            <Form.Group>
              <Form.Button content="Save" icon={<Icon name="save"/>} basic color='green' onClick={(e) => this._save(e)}/>
              <Form.Button content="Delete" icon={<Icon name="trash"/>} basic color='red' onClick={(e) => this._delete(e)}/>
            </Form.Group>
          </Form>
        </Grid.Column>
      </Grid.Row>
    );
  }

  _onDrop(files) {
    if (files.length > 0) this.upload(files[0]);
  }

  upload(file) {
    Images.insert(file, (error, fileObj) => {
      if (error) return alert(error.reason);
      const data = {
        imageId: fileObj._id,
        sponsorId: this.props.sponsor._id,
      };
      Meteor.call('sponsors.updateImage', data);
    });
  }

  _handleTextChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  _handleDataChange(e, data) {
    const { name, value, checked } = data;
    // console.log(data);
    this.setState({ [name]: (value || checked) });
  }

  _save(e) {
    const data = pick(this.state, ['_id', 'name', 'amount', 'publish', 'logoUrl', 'imageId']);
    Meteor.call('sponsors.update', data, (error, result) => {
      if (error) return alert(error.reason);
    });
  }

  _delete(e) {
    if (confirm(`Are you sure you want to delete ${this.state.name} form the sponsors list?`)) {
      Meteor.call('sponsors.remove', this.props.sponsor._id, (error, result) => {
        if (error) return alert(error.reason);
      });
    }
  }
}

SponsorRow.propTypes = {
  sponsor: PropTypes.object,
};

export default SponsorRow;
