import { Meteor } from 'meteor/meteor';
import { Link } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import React, { Component } from 'react';
import { Container, Message, Segment, Icon, } from 'semantic-ui-react';
import LinkButton from '../imports/LinkButton';
import moment from 'moment';
import { extend } from 'lodash';

import { browserHistory } from '../../history';

const { eventYear } = Meteor.settings.public;
let link = 'https://foundation.wwu.edu/greatpuzzlehunt';

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
          <ProfileEditor user={this.props.user} />
          {showTeamPreview ? <ProfileTeamPreview /> : null }

          <PasswordEditor />
          <div>
            <Message
              info size='large'
              header='Help keep us afloat!'
              content={`One of our goals is to keep the WWU Great
                        Puzzle Hunt FREE so that EVERYONE can participate.
                        To do that, we depend on donations from those who
                        can afford them. If you are able, please consider
                         making a small donation (suggested $5 students,
                         $10 nonstudents) and/or buying a shirt (our only fund
                         raiser)`}
            />
            </div>
            <br/>
            <div>
            <LinkButton as='a'
              href={link}
              size='large'  content='Donate Online'
              icon={<Icon name='heart'/>}
              color="green"
            />
            <LinkButton as='a' href="/gear"
              size="large" color="orange" target="_blank"
              icon={<Icon name="shopping cart" />}
              content="Buy Gear"
            />
          </div>
        </Segment>
      </Container>
    );
  }
}

Profile = withTracker((props) => {
  const handle = Meteor.subscribe('gamestate');
  const ready = handle.ready();
  const gamestate = Gamestate.findOne({});
  return {
    ready: ready,
    gamestate: gamestate,
    user: Meteor.user(),
  };
})(Profile);
