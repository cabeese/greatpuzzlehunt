import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Container, Grid, List, Segment, Message } from 'semantic-ui-react';

const { regularRegistrationStart, eventDate, eventDay, gearSaleEnd } = Meteor.settings.public;

import HomeBanner from './imports/HomeBanner';
import HomeHeader from './imports/HomeHeader';
import HomeIntro from './imports/HomeIntro';
import HomeEarlyBird from './imports/HomeEarlyBird';
import HomePastEvents from './imports/HomePastEvents';
import HomePeople from './imports/HomePeople';
import HomeDonate from './imports/HomeDonate';
import HomeDonate0 from './imports/HomeDonate0';
import HomeSponsors from './imports/HomeSponsors';
import SamplePuzzles from './imports/SamplePuzzles';

Home = class Home extends Component {
  render() {
    return (
      <div>
        <HomeBanner />

        <HomeHeader/>

        <HomeDonate0 />

        <HomeEarlyBird/>

        <HomeIntro/>

        <HomeDonate/>

        <a name='sponsors'/>

        <HomeSponsors/>
      </div>
    );
  }
}
