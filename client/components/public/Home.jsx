import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Container, Grid, List, Segment, Message } from 'semantic-ui-react';

const { regularRegistrationStart, eventDate, eventDay, gearSaleEnd } = Meteor.settings.public;

import HomeBanner from './imports/HomeBanner';
import HomeHeader from './imports/HomeHeader';
import HomeAboutSplit from './imports/HomeAboutSplit';
import HomeRegister from './imports/HomeRegister';
import HomeDonate from './imports/HomeDonate';
import HomeSponsors from './imports/HomeSponsors';

Home = class Home extends Component {
  render() {
    return (
      <div>
        <HomeBanner />

        <HomeHeader/>

        <HomeAboutSplit />

        <HomeRegister />

        <HomeDonate/>

        <a name='sponsors'/>

        <HomeSponsors/>
      </div>
    );
  }
};
