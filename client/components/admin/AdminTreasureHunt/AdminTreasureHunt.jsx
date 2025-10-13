import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { Container, Divider, Message, Segment } from 'semantic-ui-react';

import CheckpointEditor from './imports/CheckpointEditor';
import CheckpointList from './imports/CheckpointList';
import GamestateControls from '../AdminGamestate/imports/GamestateControls';

AdminTreasureHunt = class AdminTreasureHunt extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeCheckpoint: null,
    };
  }

  render() {
    return (
      <Container>
        <PuzzlePageTitle title='Treasure Hunt Checkpoints'/>
        <Segment>
        <CheckpointList
          activeCheckpoint={this.state.activeCheckpoint}
          onEdit={ (checkpoint) => this._editCheckpoint(checkpoint) }
          onDelete={ (checkpoint) => this._deleteCheckpoint(checkpoint) }
        />
        </Segment>

        <Segment>
          { this._editor() }
        </Segment>
      </Container>
    );
  }

  _editor() {
    const { activeCheckpoint } = this.state;
    if (!activeCheckpoint) {
      return <Message info content='Select a checkpoint to edit...'/>;
    }
    return (
      <CheckpointEditor
        checkpoint={ activeCheckpoint }
        key={activeCheckpoint._id}
        closeCheckpoint={ () => this.setState({ activeCheckpoint: null }) }
      />
    );
  }

  _editCheckpoint(checkpoint) {
    this.setState({ activeCheckpoint: checkpoint });
  }

  async _deleteCheckpoint(checkpoint) {
    if (!confirm(`Are you sure you want to delete ${checkpoint.name} (${checkpoint._id})?`)) return;
    try {
      await Meteor.callAsync('admin.thcheckpoints.delete', checkpoint._id);
      console.log(`Deleted checkpoint ${checkpoint.name} (${checkpoint._id})`);
    } catch (error) {
      alert(error.reason);
    }
  }
}
