import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { Scrollchor } from 'react-scrollchor';
import YouTube from 'react-youtube';
import { Grid, Container, Segment, Header, Icon, Message, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import moment from 'moment';

import LinkButton from '../../imports/LinkButton';
// TODO: is this needed? Do we need any gamestate?
import GamestateComp from '../../imports/GamestateComp';

const { eventYear, eventDate, eventDay,
        earlyBirdLastDate, registrationCloseDate, } = Meteor.settings.public;

class HomeAboutSplit extends Component {
  render() {
    return (
      <Container>
        <Grid stackable padded columns={2} divided textAlign='center'>
          {this.puzzleHuntColumn()}

          {this.treasureHuntColumn()}
        </Grid>
      </Container>
    );
  }

  puzzleHuntColumn() {
    return (
      <Grid.Column width={7}>
        <div className="wavy-circle">
          <img src="/img/GPH-icons-puzzle.svg" />
        </div>
        <Header as="h1" size="medium">
          Puzzle Hunt
        </Header>

        <p>
          Teams of up to 6 (recommended size 4-6) work virtually or travel on foot about WWU campus (outdoors) solving a collection of puzzles involving logic, patterns, decoding, and a variety of skill sets. <Link to="register">Registration</Link> required.
        </p>
        <Link to="about-gph">
          <Button
            size='large'
            content='VIEW MORE DETAILS'
            color="blue"
          />
        </Link>

        <Header as="h2" size="medium">
          When
        </Header>
        <p>
	  {eventDay}, {eventDate}
          <br />
          9:30 AM - 4:30 PM
        </p>

        <Header as="h2" size="medium">
          Where
        </Header>
        <p>
          <strong>In Person:</strong> Red Square<br />
          Western Washington University<br />
          516 High Street Bellingham, WA 98225

          <br /><br />

          <strong>Virtual:</strong> Anywhere that has internet access,
          a smartphone or computer, a printer,
          and <Link to="about-gph#tools">the required tools</Link>.
        </p>
      </Grid.Column>
    );
  }

  treasureHuntColumn() {
    return (
      <Grid.Column width={7}>
        <div className="wavy-circle">
          <img src="/img/GPH-icons-chest.svg" />
        </div>

        <Header as="h1" size="medium">
          Treasure Hunt
        </Header>

        <p>
          <strong>Find the hidden treasure!</strong> A FREE, fun outdoor adventure. Use a compass and map orienteering to collect clues & respond to questions, ulteimately collecting a memento from the hidden treasure chest on the WWU campus!
        </p>
        <Link to="about-th">
          <Button
            size='large'
            content='VIEW MORE DETAILS'
            color="blue"
          />
        </Link>

        <Header as="h2" size="medium">
          When
        </Header>
        <p>
          Open April 19, 2026, 7:00 AM to April 20, 2026, 8:00 PM.
        </p>
        <p>
          <em>GPH finishers gain early access to the Treasure Hunt on April 18, 2026.</em>
        </p>

        <Header as="h2" size="medium">
          Where
        </Header>
        <p>
          <strong>In Person only</strong><br />
          On the beautiful WWU campus<br />
          in Bellingham, WA.
        </p>
      </Grid.Column>
    );
  }
}

HomeAboutSplit = GamestateComp(HomeAboutSplit);
export default HomeAboutSplit;
