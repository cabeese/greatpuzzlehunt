import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Icon } from 'semantic-ui-react';

class AdminTeamActions extends Component {
  render() {
    const { team, onToggleCheckedIn } = this.props;

    return (
      <div>
        <Button
          basic
          color={ team.checkinConfirmed ? 'green' : 'red'}
          onClick={ onToggleCheckedIn }
          icon={ <Icon name={ team.checkinConfirmed ? 'thumbs up' : 'thumbs down'}/> }
        />
      </div>
    );
  }
}

AdminTeamActions.propTypes = {
  team: PropTypes.object.isRequired,
  onToggleCheckedIn: PropTypes.func.isRequired,
};

export default AdminTeamActions;
