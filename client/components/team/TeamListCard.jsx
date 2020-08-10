import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, Icon, Button, Progress, Form, Popup, Header } from 'semantic-ui-react';

import { DIVISION_MAP } from './imports/team-helpers.js';
import ContactModal from '../imports/contact-modal';

TeamListCard = class TeamListCard extends Component {
  constructor(props) {
    super(props);
    const { team } = this.props;
    Meteor.call('team.owner', team.owner, (error, owner) => {
      if (error) return console.log(error);
      this.setState({ owner });
    });

    this.state = {
      isFull: team.members.length >= 6,
      memberCount: team.members.length,
      division: DIVISION_MAP[team.division],
      lookingForMembers: team.lookingForMembers,
      showPasswordField: false,
      owner: {},
      password: '',
    };
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
    const { division, memberCount } = this.state;
    const { team } = this.props;
    const membersLabel = `${memberCount} of 6 members`;
    const membersPercent = Math.round((memberCount / 6)*100);
    const progressColor = this._getProgressColor(memberCount);

    return (
      <Card centered>
        <Card.Content>
          <Card.Header>{ team.name }</Card.Header>
          <Card.Meta><Icon name='sitemap'/> { division }</Card.Meta>
          <Card.Description>
            <Progress size='small' percent={ membersPercent } color={progressColor}>{ membersLabel }</Progress>
          </Card.Description>
        </Card.Content>

        { this._getCardExtra() }
      </Card>
    );
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

    const { showPasswordField, isFull, lookingForMembers } = this.state;
    if (isFull) return null;

    const lookingBtn = (!showPasswordField && lookingForMembers) ? <ContactModal /> : null;

    const joinBtn = !showPasswordField ? <Button basic size='small' floated='right' icon='reply' labelPosition='right' content='Join Team' onClick={() => this.setState({ showPasswordField: true })}/> : null;
    const passwordForm = showPasswordField ? this._renderPasswordField() : null;
    return (
      <Card.Content extra>
        { lookingBtn }
        { joinBtn }
        { passwordForm }
      </Card.Content>
    );
  }

  _renderPasswordField() {
    return (
      <Form onSubmit={(e) => this._handlePasswordSubmit(e)}>
        <Form.Input id={this._getPasswordId()} name='password' label='Team Password' value={ this.state.password } onChange={(e) => this.setState({ password: e.target.value })}/>
        <Button color='green' type='submit' content='Submit' size='small'/>
        <Button floated='right' color='red' inverted content='Cancel' size='small' onClick={(e) => this._cancel(e)}/>
      </Form>
    );
  }

  _handlePasswordSubmit(e) {
    e.preventDefault();
    const { password } = this.state;
    if (!password) return alert('You must enter a password!');

    Meteor.call('teams.join', this.props.team._id, password, (error, result) => {
      if (error) alert(error.reason);
    });
  }

  _cancel(e) {
    e.preventDefault();
    this.setState({ password: '', showPasswordField: false });
  }
}

TeamListCard.propTypes = {
  team: PropTypes.object.isRequired,
};
