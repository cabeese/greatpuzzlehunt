import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { Grid, Card, Container, Segment, Header, Button, Icon, Image } from 'semantic-ui-react';

export default class SamplePuzzles extends Component {
  constructor(props) {
    super(props);

    this.puzzles = {
      '2016': [
        {
          name: 'Cite Unseen',
          link: 'Cite-Unseen.pdf',
        },
        {
          name: 'Fold and Behold',
          link: 'Fold-and-Behold.pdf',
        },
        {
          name: 'Stop the Clock',
          link: 'Stop-the-Clock.pdf',
        },
        {
          name: 'Time will Tell',
          link: 'Time-will-Tell.pdf',
        }
      ],
      '2021': [
        {
          name: 'Scents and Scents-Ability!',
          link: '',
        },
        {
          name: 'Dough, a Dear!',
          link: '',
        },
        {
          name: 'My Life is in Ruins!',
          link: '',
        },
        {
          name: 'The Inside Scoop!',
          link: '',
        },
        {
          name: 'Meta-Puzzle',
          link: '',
        }
      ]
    }
  }


  render() {
    return (
        
        <Container className="section">
          <Segment basic>
          <PuzzlePageTitle title="Sample Puzzles" />
          <Grid padded centered textAlign="left" stackable>
            <Grid.Row>
              <Grid.Column width={16}>
                Below you can find some of the past Puzzles. Download them and try to solve them for yourself!
              </Grid.Column>
            </Grid.Row>
            { this._puzzles() }

          </Grid>
          <Image fluid src="/img/2016/event-photos/team-the-purple-penguins-thin.jpg"/>
        </Segment>
       </Container>
       
    )
  }


  _puzzles() {
    return Object.keys(this.puzzles).map((key) => (
      <Grid.Row centered columns={4}>
      <h1>Hello, World!</h1>
      { console.log("map") }
        { this.puzzles[key].map((puzzle, j) => (
          <Grid.Column key={`puzzle-${j}`}>
            <Segment style={{minHeight:'250px'}} padded inverted color='blue' key={ puzzle.link }>
              <Header as='h1' size="medium">{ puzzle.name }</Header>
                <p>Hello!</p>
              <br/>
              <br/>
              <Button  as='a' href='_blank' href={`/puzzles/2016/${puzzle.link}`} content='Download'/>
            </Segment>
          </Grid.Column>
        )) 
        }
      </Grid.Row>
    ));
      
  }
}
