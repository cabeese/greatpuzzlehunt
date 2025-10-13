import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { sortBy} from 'lodash';
import PropTypes from 'prop-types';
import { Grid, Header, Label, Button, Icon, Popup, List, } from 'semantic-ui-react';

import checkpointTracker from './CheckpointTracker';

class CheckpointList extends Component {
  render() {
    return (
      <Grid stackable>
        { this._actions() }
        { this._checkpoints() }
      </Grid>
    );
  }

  _actions() {
    return (
      <Grid.Row columns='1'>
        <Grid.Column>
          <Header as='h3' content='Checkpoints'/>
          <Button basic size='small' content='New Checkpoint'
                  onClick={async () => await this._createCheckpoint() }/>
        </Grid.Column>
      </Grid.Row>
    );
  }

  async _createCheckpoint() {
    try {
      await Meteor.callAsync('admin.thcheckpoints.create');
    } catch (error) {
      alert(error.reason);
    }
  }

  _checkpoints() {
    const { checkpoints, activeCheckpoint } = this.props;
    const activeCheckpointId = activeCheckpoint ? activeCheckpoint._id : null;
    const sortedCheckpoints = sortBy(checkpoints, ['sequence', 'name'])

    return sortedCheckpoints.map((checkpoint) => this._checkpoint(checkpoint, activeCheckpointId));
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

  _checkpoint(checkpoint, activeCheckpointId) {
    const isActive = checkpoint._id === activeCheckpointId;
    let issues = []; 
    const text_fields = ["name", "startDescription", "finishDescription"];
    const num_fields = ["sequence"];
    text_fields.forEach(field => {
      if (checkpoint[field] === '') {
        issues.push(`Invalid value for ${field}`);
      }
    });
    num_fields.forEach(field => {
      if (checkpoint[field] === '' || checkpoint[field] < 0 || isNaN(checkpoint[field])) {
        issues.push(`Invalid value for ${field}`);
      }
    });
    // puzzle.hints.forEach((hint, i) => {
    //   if (!hint.imageUrl && !hint.text) {
    //     issues.push(`Hint ${i} empty or missing data`);
    //   }
    // });

    return (
      <Grid.Row columns={3} name={ checkpoint._id} key={ checkpoint._id } color={isActive ? "teal" : undefined}>
        <Grid.Column>
          <Label content={ checkpoint.sequence }/>&nbsp; { checkpoint.name }
        </Grid.Column>
	<Grid.Column>
	  { this._numWaypoints(checkpoint) }&nbsp; waypoints
        </Grid.Column>
        <Grid.Column>
          { this._validation(issues) }
          <Button basic floated='right'
            icon='trash'
            onClick={ () => this._delete(checkpoint) }
          />
          <Button basic floated='right'
            content='Edit'
            color='green'
            onClick={ () => this._edit(checkpoint) }
          />
        </Grid.Column>
      </Grid.Row>
    );
  }

  _numWaypoints(checkpoint) {
    var num=0;
    num += checkpoint.cw0 ? 1 : 0;
    num += checkpoint.cw1 ? 1 : 0;
    num += checkpoint.cw2 ? 1 : 0;
    num += checkpoint.cw3 ? 1 : 0;
    num += checkpoint.cw4 ? 1 : 0;
    return num;
  }

  _edit(checkpoint) {
    this.props.onEdit(checkpoint);
  }

  _delete(checkpoint) {
    this.props.onDelete(checkpoint);
  }
}

CheckpointList.propTypes = {
  checkpoints: PropTypes.array.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default checkpointTracker(CheckpointList);
