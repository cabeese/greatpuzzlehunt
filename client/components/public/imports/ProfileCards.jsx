import React, { Component } from 'react';
import { Grid, Segment, Card, Image, Button, Icon } from 'semantic-ui-react';
import { map } from 'lodash';

export default class ProfileCards extends Component {

  constructor(props) {
    super(props);

    this.puzzleTeam = [
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
        name: 'Zac Pontrantolfi',
        title: '',
        role: 'Puzzle Master Team',
        image: '/img/team/zac.jpg',
      }
    ];

    this.marketingPromo = [
      {
        name: 'Kate Jensen',
        title: '',
        role: 'Co-President, Marketing & Promotion',
        image: '/img/team/kate_jensen.jpg'
      },
      {
        name: 'Siri Khalsa',
        title: '',
        role: 'Co-President, Marketing & Promotion',
        image: '/img/team/siri_khalsa.jpg'
      },
    ];

    this.developers = [
      {
        name: 'Noah Strong',
        title: '',
        role: 'Lead Developer',
        image: '/img/team/noah_s.jpg',
      },

      {
        name: 'Raiden van Bronkhorst',
        title: '',
        role: 'Lead Developer & Tech Support',
        image: '/img/team/raiden_v.jpg',
      },

      {
        name: 'Richard Golding',
        title: '',
        role: 'Lead Developer & Tech Support',
        image: '/img/team/richard.jpg'
      },
    ];

    this.budgetCoord = [
	  {
        name: 'Mayla Ward',
        title: '',
        role: 'Co-President, Budget Coordination',
        image: '/img/team/mayla.png',
      },
	  
	  {
        name: 'Noah Jensen',
        title: '',
        role: 'Co-President, Budget Coordination',
        image: '/img/team/noah_j.png',
      },

      {
        name: 'Joanna Schroeder',
        title: '',
        role: 'VP, Budget Coordination',
        image: '/img/team/joanna.jpg'
      }
    ];
	
    this.management = [
	  {
        name: 'Lucas Ragsdale',
        title: '',
        role: 'Co-President, Management',
        image: '/img/team/lucas.png',
      },
	  
	  {
        name: 'Owen Montefisher',
        title: '',
        role: 'Co-President, Management',
        image: '/img/team/owen.png',
      },
	  
	  {
        name: 'Andy Nugent',
        title: '',
        role: 'VP, Management',
        image: '/img/team/andy.png',
      }
    ];

    this.pastProfiles = [
      {
        name: 'Eric Fox',
        title: '',
        role: 'Developer',
        image: '/img/team/eric.png'
      },
      {
        name: 'Katie Lane',
        title: '',
        role: 'Co-President, Marketing & Promotion',
        image: '/img/team/katie.png'
      },
      {
        name: 'Anya Davis',
        title: '',
        role: 'Co-President, Marketing & Promotion',
        image: '/img/team/anya.png'
      },
      {
        name: 'Dalton Lange',
        title: '',
        role: 'VP, Marketing & Promotion',
        image: '/img/team/dalton.jpg',
      },
      {
        name: 'Alexandria Tan',
        title: '',
        role: 'Developer & Tech Support; VP, Marketing & Promotion',
        image: '/img/team/alexandria_tan.jpg'
      },
      {
        name: 'Nick Satnik',
        title: '',
        role: 'Co-President, Management',
        image: '/img/team/nick.jpg',
      },
      {
        name: 'Zoe Bozich',
        title: '',
        role: 'Co-President, Budget Coordination',
        image: '/img/team/zoe.jpg',
      },
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
          { this._renderProfiles(this.puzzleTeam) }
        </Card.Group>
    
        <h2>Developers</h2>
        <Card.Group stackable doubling itemsPerRow={3}>
          { this._renderProfiles(this.developers) }
        </Card.Group>
      

        <h2>Marketing &amp; Promotion</h2>
        <Card.Group stackable doubling itemsPerRow={3}>
          { this._renderProfiles(this.marketingPromo) }
        </Card.Group>

        <h2>Management</h2>
        <Card.Group stackable doubling itemsPerRow={3}>
          { this._renderProfiles(this.management) }
        </Card.Group>

        <h2>Budget Coordination</h2>
        <Card.Group stackable doubling itemsPerRow={3}>
          { this._renderProfiles(this.budgetCoord) }
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
