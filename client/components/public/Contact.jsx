import React, { Component } from 'react';

import HomePeople from './imports/HomePeople';
import ProfileCards from './imports/ProfileCards';
import ICEContact from '../imports/ice-contact';
import {Container, Segment} from 'semantic-ui-react';


Contact = class Contact extends Component {

  render() {
    return (
      <Container className="section">
      <Segment basic>
      <PuzzlePageTitle title="Contact"/>
      <ICEContact/>
      <h3>
        For Event Questions Contact Millie at <a href='mailto:millie@greatpuzzlehunt.com'>millie.johnson@wwu.edu</a>
        <br/><br/>
        For Account/Tech Questions Contact <a href='mailto:support@greatpuzzlehunt.com'>support@greatpuzzlehunt.com</a>
      </h3>
      <HomePeople />
      <ProfileCards />

      </Segment>
      </Container>
    );
  }

}
