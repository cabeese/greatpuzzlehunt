import React, { Component } from 'react';
import { Grid, Segment, Card, Image, Button, Icon } from 'semantic-ui-react';
import { map } from 'lodash';

export default class ProfileCards extends Component {

  constructor(props) {
    super(props);

    this.currentProfiles = [
      {
        name: 'Millie Johnson',
        title: '',
        role: 'Director, Founder, Coordinator, Puzzle Creator',
        image: '/img/2016/event-photos/millie_johnson.jpg',
      },
      {
        name: 'Wendy Aguilar',
        title: '',
        role: 'Lead Designer',
        image: '/img/team/wendy.jpg',
      },
      {
        name: 'Noah Strong',
        title: '',
        role: 'Lead Developer',
        image: '/img/team/noah.jpg',
      },
      {
        name: 'Raiden van Bronkhorst',
        title: '',
        role: 'Lead Developer & Tech Support',
        image: '/img/team/raiden_v.jpg',
      },
      {
        name: 'Zac Pontrantolfi',
        title: '',
        role: 'Puzzle Master Team',
        image: '/img/team/zac.jpg',
      },
      {
        name: 'Zoe Bozich',
        title: '',
        role: 'President, Budget Coordination',
        image: '/img/team/zoe.jpg',
      },
      {
        name: 'Nick Satnik',
        title: '',
        role: 'President Management',
        image: '/img/team/nick.jpg',
      },
      {
        name: 'Dalton Lange',
        title: '',
        role: 'VP Marketing & Promotion, Developer',
        image: '/img/team/dalton.jpg',
      },
      {
        name: 'Katie Lane',
        title: '',
        role: 'Co-President, Marketing and Promotion',
        image: '/img/team/katie.png'
      },

      {
        name: 'Alexandria Tan',
        title: '',
        role: 'Co-President, Marketing and Promotion, Developer',
        image: '/img/team/alexandria_tan.jpg'
      }

    ];

    this.pastProfiles = [
      {
        name: 'Miranda Reed',
        title: '',
        role: 'President, Budget Coordination',
        image: '/img/team/miranda_r.jpeg',
      },
      {
        name: 'Rachel Snyder',
        title: '',
        role: 'Co-President, Management',
        image: '/img/team/rachel.jpg',
      },
      {
        name: 'Danielle Glewwe',
        title: '',
        role: 'Vice President, Management',
        image: '/img/team/danielle_g.jpg',
      },
      {
        name: 'Montana Williams',
        title: '',
        role: 'Vice President, Management',
        image: '/img/team/montana.jpg',
      },
      {
        name: 'Alex Kuhn',
        title: '',
        role: 'Vice President, Marketing & Promotion',
        image: '/img/team/alex_k.jpg',
      },
      {
        name: 'Katrina Duttkin',
        title: '',
        role: 'Vice President, Marketing & Promotion',
        image: '/img/team/katrina.jpg',
      },
      {
        name: 'Patrick Carroll',
        title: '',
        role: 'Co-President, Marketing & Promotion',
        image: '/img/team/patrick_c.jpg',
      },
      {
        name: 'Jordan King',
        title: '',
        role: 'President, Management',
        image: '/img/team/jordan_k.jpg',
      },
      {
        name: 'Brennan Commons',
        title: '',
        role: 'Co-Lead Designer',
        image: '/img/team/brennan.jpg',
      },
      {
        name: 'Ben Johnson',
        title: '',
        role: 'Lead Developer',
        image: '/img/team/ben.jpg',
      },
      {
        name: 'Kyle Rader',
        title: '',
        role: 'Lead developer and secondary event coordinator',
        image: '/img/team/kyle.jpg',
      },
      {
        name: 'Zoe & Jeff',
        title: '',
        role: 'Puzzle Master Team',
        image: '/img/team/jeff-zoe.jpg',
      },
      {
        name: 'Scott St. Clair',
        title: '',
        role: 'Club President 2017-18',
        image: '/img/team/scott.jpg',
      },

      {
        name: 'Alex Covington',
        title: '',
        role: 'Developer',
        image: '/img/team/alex_c.jpg',
      },
      {
        name: 'Elias Peters',
        title: '',
        role: 'Club Co-President',
        image: '/img/team/elias_p.jpg',
      },
    ]
  }

  render() {
    return (
      <div>
        <h1>Our Leadership</h1>
        <Card.Group stackable doubling itemsPerRow={3}>
          { this._renderProfiles(this.currentProfiles) }
        </Card.Group>

        <h1>Past Leadership</h1>
        <Card.Group stackable doubling itemsPerRow={3}>
          { this._renderProfiles(this.pastProfiles) }
        </Card.Group>
      </div>
    );
  }

  _renderProfiles(profiles) {
    return map(profiles, (profile) => this._renderProfileCard(profile));
  }

  _renderProfileCard({ name, title, role, image }) {
    return <Card key={name}
      image={image}
      header={name}
      meta={title}
      description={role}
    />;
  }
}
