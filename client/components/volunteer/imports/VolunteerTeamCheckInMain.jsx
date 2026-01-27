import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Segment,
  List,
  Header,
  Button,
  Icon,
  Message,
  Label,
  Confirm,
  Grid
} from 'semantic-ui-react';

import VolunteerTeamComp from './VolunteerTeamComp';

import {WRIST_BAND_COLOR} from "../../team/imports/team-helpers";

const {eventYear} = Meteor.settings.public;

class VolunteerTeamCheckInMain extends Component {
  constructor(props) {
    super(props);
    this.state = { showConfirm: false };
  }

  render() {
    const { teamId, ready, team, teamMembers } = this.props;
    if (!ready) return <Loading/>;
    if (ready && !team) return this._noTeam(teamId);

    return (
      <div>
        {this._header()}
	{this._eligibleMessage(team)}
	{this._notPlayingMessage(team)}
        {this._itemsToGive(team, teamMembers)}
        {this._confirmButton(team)}
        {this._members(teamMembers)}
        {this._confirmModal(team)}
      </div>
    );
  }

  _noTeam(teamId) {
    return <Message warning icon="warning" header="Oops, No team found" content={`There is no team with id: "${teamId}"`}/>
  }

  _header() {
    const { name } = this.props.team;
    let title = `GPH ${eventYear} Check In`
    return <PuzzlePageTitle title={title} subtitle={name}/>;
  }

  _itemsToGive(team, teamMembers) {
    let noPhotoUsers = 0;
    let packets = 0;
    const { division, checkinConfirmed } = team;

    if (!checkinConfirmed){
      return (
        <Message info size="large">
          <Message.Header>Confirm check-in to see what they need.</Message.Header>
        </Message>
      )
    };
    teamMembers.forEach(member => {
      if (member.checkedIn && member.playingPuzzleHunt && (member.gameMode === 'INPERSON')) packets++;
      if (!member.photoPermission) noPhotoUsers++;
    });

    return (
      <Message info size="large">
        <Message.Header>Give to this team:</Message.Header>
        <Message.Content>
          <p></p>
          <List bulleted>
            <List.Item><b>{noPhotoUsers}</b> Anti-Photo Badges</List.Item>
            <List.Item><b>{packets}</b> Swag Bags</List.Item>
            <List.Item><b>{packets}</b> <Label color={WRIST_BAND_COLOR[division].toLowerCase()}>{WRIST_BAND_COLOR[division]}</Label> Wrist Bands</List.Item>
          </List>
        </Message.Content>
      </Message>
    );
  }


  _notPlayingMessage(team) {
    if (!team.playingPuzzleHunt) {
      return (
	<Message icon="warning"
		 size="large"
		 warning
		 header="Not playing puzzle hunt"
		 content="There is a problem with this team's registration. They are marked as not playing the puzzle hunt. Please send the team to the Puzzle Hunt admin to adjust registration." />
      );
    } else {
      return null;
    }
  }

  _eligibleMessage(team) {
    if (team.prize_ineligible) {
      return(
        <Message icon="warning" size="large" warning header="Ineligible for prizes"
		 content="There is an issue with this team's registration, and they have been marked ineligible for prizes and leaderboard. Please send the team to the Puzzle Hunt admin to complete registration." />
      );
    } else {
      return(null);
    }
  }

  _members(members) {
    return (
      <Segment basic>
        <Header as="h3" content="Team Members"/>

        <Grid>
        { members.map((member) => this._member(member)) }
        </Grid>
      </Segment>
    );
  }

  _member(member) {
    const success = member.paid && member.checkedIn;
    const warning = member.paid && !member.checkedIn;
    const failure = !member.paid; // or missing info
    const status = this._status(member);

    const className = success ? "green" : (warning ? "yellow" : "red");

    return (
      //<Message positive={success} warning={warning} negative={failure} key={member._id}>
        //<Message.Content>
          <Grid.Row columns={3} className={className} key={member._id}>
            <Grid.Column width={8}>
              { member.name }
            </Grid.Column>
            <Grid.Column width={4}>
              { (member.gameMode === 'INPERSON') ? 
                <><Icon name="group" color="blue" /> In-Person</>
                :
                <><Icon name="video" color="yellow" /> Virtual</>
              }
            </Grid.Column>
            <Grid.Column width={4}>
              { status }
            </Grid.Column>
          </Grid.Row>

          //{member.name}
          //<Label style={{float: 'right'}}>{status}</Label>
        //</Message.Content>
      //</Message>
    );
  }

  _status(member) {
    const { paid, checkedIn } = member;
    if (!paid) return "Needs Ticket!";
    else if (paid && !checkedIn) return "Not Here";
    else return "Ready to Play!";
  }

  _confirmButton(team) {
    const { checkinConfirmed: confirmed, name } = team;
    let content = <Button fluid size="large" color="green" content="Confirm Check In" onClick={() => this.setState({ showConfirm: true })} />;
    if (confirmed) {
      content = <Message success header="Check In Confirmed!" content={`${name} is ready to play!`}/>
    }
    return (
      <Segment basic>
        {content}
      </Segment>
    );
  }

  async _confirmTeamCheckin({_id: teamId, name}) {
    try {
      await Meteor.callAsync('team.checkin.confirm', teamId);
    } catch (error) {
      alert(error.reason);
    }
    this.setState({ showConfirm: false });
  }

  _confirmModal(team) {
    const { showConfirm } = this.state;
    return (
      <Confirm open={showConfirm}
        header="Confirm Checkin?"
        size="large"
        content={<Segment basic style={{fontSize: '16px'}}><p>Are you sure you want to confirm check in for</p><p><b>{team.name}</b>?</p></Segment>}
        cancelButton="Cancel"
        confirmButton="Yes Check Them In!"
        onCancel={() => this.setState({ showConfirm: false })}
        onConfirm={async () => await this._confirmTeamCheckin(team)} />
    );
  }
}

VolunteerTeamCheckInMain.propTypes = {
  teamId: PropTypes.string.isRequired,
  ready: PropTypes.bool.isRequired,
  team: PropTypes.object,
  teamMembers: PropTypes.arrayOf(Object),
};

export default VolunteerTeamComp(VolunteerTeamCheckInMain);
