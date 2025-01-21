import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, Icon, Button, Progress, Form, Popup, Header } from 'semantic-ui-react';
import moment from 'moment';

import { DIVISION_MAP } from './imports/team-helpers.js';

TeamListCard = class TeamListCard extends Component {
  constructor(props) {
    super(props);
    const { team } = this.props;

    this.state = {
      isFull: team.members.length >= 6,
      memberCount: team.members.length,
      division: DIVISION_MAP[team.division],
      lookingForMembers: team.lookingForMembers,
      inPerson: team.inPerson,
      showPasswordField: false,
      showOwner: false,
      owner: {},
      password: '',
    };
  }

  async componentDidMount() {
    try {
      const { team } = this.props;
      const owner = await Meteor.callAsync('team.owner', team.owner);
      // TODO: handle case where this completes after component unmounts
      this.setState({ owner });
    } catch (error) {
      console.log(error);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.showPasswordField && this.state.showPasswordField) {
      $(`#${this._getPasswordId()} > input`).focus();
    }
  }

  _getPasswordId() {
    return `password-${this.props.team._id}`;
  }

  render() {
    const { division, showPasswordField, memberCount, inPerson, } = this.state;
    const { team } = this.props;
    const membersLabelPostfix = this.state.isFull ? " (full)" : "";
    const membersLabel = `${memberCount} of 6 members ${membersLabelPostfix}`;
    const membersPercent = Math.round((memberCount / 6)*100);
    const progressColor = this._getProgressColor(memberCount);

    return (
      <Card centered>
        <Card.Content>
          <Card.Header>{ team.name }</Card.Header>
          <Card.Meta>
            { this._getGameModeIcon(inPerson) } { division }
          </Card.Meta>
          <Card.Description>
            <Progress size='small' percent={ membersPercent } color={progressColor}>{ membersLabel }</Progress>
          </Card.Description>
        </Card.Content>

        { this._getCardExtra() }
      </Card>
    );
  }

  _getGameModeIcon(inPerson) {
    if (inPerson === true) {
      return <Icon name="group" color="blue" />;
    } else if (inPerson === false) {
      return <Icon name="video camera" color="yellow" />;
    } else {
      // Shouldn't get here, but better to show nothing than show
      // something incorrect.
      return "";
    }
  }

  _getProgressColor(count) {
    if (count >= 6) return 'blue';
    else if (count >= 4) return 'green';
    else return 'orange';
  } 

  _getCardExtra() {
    if (this.props.public) {
      return null;
    }

    const { showPasswordField, isFull, showOwner, lookingForMembers } = this.state;

    let lookingBtn = null;
    if (!showPasswordField && lookingForMembers) {
      lookingBtn = showOwner ?
        <Popup
          trigger={<Button size='small' icon='minus' onClick={ () => this.setState({ showOwner: false })} />}
          content='Hide info'
        />
        :
        <Popup
          trigger={<Button size='small' icon='eye' color='blue' onClick={ () => this.setState({ showOwner: true })} />}
          content='Looking for Members, click for team captain info!'
        />;
    }
    const ownerInfo = showOwner ? this._renderOwnerInfo() : null;

    if (isFull) {
      // Still allow players to message the team, but not join it
      return (
        <Card.Content extra>
          { lookingBtn }
          { ownerInfo }
        </Card.Content>
      );
    }

    const joinBtn = !showOwner && !showPasswordField ? <Button basic size='small' floated='right' icon='reply' labelPosition='right' content='Join Team' onClick={() => this.setState({ showPasswordField: true })}/> : null;
    const passwordForm = showPasswordField ? this._renderPasswordField() : null;
    return (
      <Card.Content extra>
        { lookingBtn }
        { ownerInfo }
        { joinBtn }
        { passwordForm }
      </Card.Content>
    );
  }

  _renderPasswordField() {
    return (
      <Form onSubmit={async (e) => await this._handlePasswordSubmit(e)}>
        <Form.Input id={this._getPasswordId()} name='password' label='Team Password' value={ this.state.password } onChange={(e) => this.setState({ password: e.target.value })}/>
        <Button color='green' type='submit' content='Submit' size='small'/>
        <Button floated='right' color='red' inverted content='Cancel' size='small' onClick={(e) => this._cancel(e)}/>
      </Form>
    );
  }

  _renderOwnerInfo() {
    const { name, email, phone } = this.state.owner;
    return (
      <Header as='h4'>
        <Header.Content>
          { name }
            <Header.Subheader>
		<Button basic icon='mail' content='Message team captain' onClick={ () => this.props.messageuser(this.state.owner) } />
          </Header.Subheader>
        </Header.Content>
      </Header>
    );
  }

  async _handlePasswordSubmit(e) {
    e.preventDefault();
    const { password } = this.state;
    if (!password){
      alert('You must enter a password!');
      return;
    }

    try {
      await Meteor.callAsync('teams.join', this.props.team._id, password);
    } catch (error) {
      alert(error.reason);
    }
  }

  _cancel(e) {
    e.preventDefault();
    this.setState({ password: '', showPasswordField: false });
  }
}

TeamListCard.propTypes = {
  team: PropTypes.object.isRequired,
};
