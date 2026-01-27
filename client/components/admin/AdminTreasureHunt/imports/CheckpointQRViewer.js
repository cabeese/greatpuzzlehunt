import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Segment, Form, Message, Header } from 'semantic-ui-react';
import { omit } from 'lodash';
import { QRCodeCanvas } from 'qrcode.react';

class CheckpointQRViewer extends Component {
  constructor(props) {
    super(props);
    this.state = this._stateFromProps(props);
  }

  _stateFromProps(props) {
    const { checkpoint } = props;
    return omit(checkpoint, ['_id']);
  }

  render() {
    const { checkpoint } = this.props;
    const url = `${window.location.origin}/treasure/checkpoint/${checkpoint.sequence}`;
    const hdr = `Checkpoint ${checkpoint.name} QR code`;
    return (
      <Form onSubmit={ (e) => e.preventDefault() }>
        <Header as='h3' content={ hdr }/>

	<Form.Group>
          <QRCodeCanvas value={ url } size={ 212 }/>
	</Form.Group>

        <Form.Group>
          <Form.Button basic content='Close' onClick={ this.props.closeCheckpointQR }/>
        </Form.Group>

      </Form>
    );
  }
}

CheckpointQRViewer.propTypes = {
  checkpoint: PropTypes.object.isRequired,
  closeCheckpointQR: PropTypes.func.isRequired,
};

export default CheckpointQRViewer;
