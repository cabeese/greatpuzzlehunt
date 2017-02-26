import React, { Component, PropTypes } from 'react';
import { Button, Icon } from 'semantic-ui-react';

class Actions extends Component {
  render() {
    return (
      <Button.Group size='small' fluid>
        <Button basic icon='pencil' color='green' onClick={ this.props.onEdit }/>
        <Button basic color='blue' onClick={ this.props.onPasswordReset }>
          <Icon.Group>
            <Icon name='lock'/>
            <Icon name='repeat' corner/>
          </Icon.Group>
        </Button>
        <Button basic color='violet' onClick={ this.props.onEmailResend }>
          <Icon.Group>
            <Icon name='mail'/>
            <Icon name='repeat' corner/>
          </Icon.Group>
        </Button>
        <Button basic icon='trash' color='red' onClick={ this.props.onDelete }/>
      </Button.Group>
    );
  }
}

Actions.propTypes = {
  onEdit: PropTypes.func.isRequired,
  onPasswordReset: PropTypes.func.isRequired,
  onEmailResend: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default Actions;