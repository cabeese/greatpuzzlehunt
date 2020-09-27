import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Icon } from 'semantic-ui-react';

class AdminTeamActions extends Component {
  render() {
    const { team, onToggleCheckedIn, clearTeam } = this.props;
    const isCheckedIn = team.checkinConfirmed;

    return (
      <div>
        <Button
          basic
          color={ team.checkinConfirmed ? 'green' : 'red'}
          onClick={ onToggleCheckedIn }
          icon={ <Icon name={ team.checkinConfirmed ? 'check square' : 'square outline'}/> }
	  content={ team.checkinConfirmed ? "Undo Check-In" : "Check-in Team"}
        />
        <Button
          basic
          onClick={clearTeam}
          icon={ <Icon name="close" /> }
          content="Close"
          />
      </div>
    );
  }
}

AdminTeamActions.propTypes = {
  team: PropTypes.object.isRequired,
  onToggleCheckedIn: PropTypes.func.isRequired,
  clearTeam: PropTypes.func.isRequired,
};

export default AdminTeamActions;
