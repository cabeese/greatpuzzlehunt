import { Meteor } from 'meteor/meteor';
import { Link } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import React, { Component } from 'react';
import { Container, Segment, Icon, } from 'semantic-ui-react';
import moment from 'moment';
import { extend } from 'lodash';

import { browserHistory } from '../../history';

Profile = class Profile extends Component {

  constructor(props) {
    super(props);

    this.state = extend({
        edit: false,
      },
      this._makeStateFromUser(props.user)
    );
  }

  _makeStateFromUser(user) {
    return {
      updatedAt: user ? moment(user.updatedAt).fromNow() : '',
      showTeamPreview: user ? !user.hasRole('volunteer')  : false,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user) {
      this.setState(this._makeStateFromUser(nextProps.user));
    }
  }

  render() {
    return (
      <Authed accessLevel="user">
        { this.props.user ? this._renderMain() : <Loading /> }
      </Authed>
    );
  }

  _hybridMessage(){
    const { inPersonAllowed } = this.props.user;
    if (this.props.user.accountType === "VOLUNTEER") return "";

    if (inPersonAllowed){
      return (
        <Segment color="blue">
          <Icon name="group" />
          <span>
            You have an in-person ticket code.
            Great!
            Please note that <em>this does not necessarily allow you to play on
            campus this year!</em> You must set
            the <em>in-person</em> setting on your Team page separately.
            If you have questions,
            please <Link to="/contact">Contact Us</Link>!
          </span>
        </Segment>
      );
    } else {
      return (
        <Segment color="green">
          <span>You are registered to play virtually this year!</span>
        </Segment>
      );
    }
  }

  _renderMain() {
    const { showTeamPreview } = this.state;
    return (
      <Container>
        <Segment>
          <PuzzlePageTitle
            title={this.props.user.name}
            subTitle={this.props.user.getEmail()}
            />
          Last Updated: {this.state.updatedAt}
          <br />
          {this._hybridMessage()}
          <ProfileEditor user={this.props.user} />
          {showTeamPreview ? <ProfileTeamPreview /> : null }

          <PasswordEditor />
        </Segment>
      </Container>
    );
  }
}

Profile = withTracker((props) => {
  return {
    user: Meteor.user(),
  };
})(Profile);
