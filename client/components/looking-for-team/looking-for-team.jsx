import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container } from 'semantic-ui-react';

import LFTUserList from './imports/lft-user-list';

LookingForTeam = class LookingForTeam extends Component {
  render() {
    return (
      <Container>
        <PuzzlePageTitle title='Players Looking for a Team' />
        <LFTUserList/>
      </Container>
    );
  }
}
