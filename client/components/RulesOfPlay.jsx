import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Scrollchor from 'react-scrollchor';
import {
  Container,
  Segment,
} from 'semantic-ui-react';
import { Meteor } from 'meteor/meteor';
import Rules from './public/imports/rules';

const { eventYear } = Meteor.settings.public;

RulesOfPlay = class RulesOfPlay extends Component {
  render() {
    return (
      <Container className="section">
      <Segment basic>
        <PuzzlePageTitle title={`${eventYear} Rules of Play`}/>

        <Rules />
        </Segment>
      </Container>
    );
  }
};
