import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import {
  Container,
} from 'semantic-ui-react';

// Public Team List
PublicTeamList = class PublicTeamList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
        <TeamBrowser public={true}/>
    );
  }
}
