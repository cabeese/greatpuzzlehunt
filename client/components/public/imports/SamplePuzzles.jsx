import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { List } from 'semantic-ui-react';
import { Grid, Card, Container, Segment, Header, Button, Icon, Image, Accordion } from 'semantic-ui-react';
import GamestateComp from '../../imports/GamestateComp';

export default class SamplePuzzles extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.puzzles = {
      '2021': [
        {
          name: 'Scents and Scents-Ability!',
          link: '',
          hints: [
            "/img/2016/event-photos/team-the-purple-penguins-thin.jpg"
          ]
        },
        {
          name: 'Dough, a Dear!',
          link: '',
          hints: [
            
          ]
        },
        {
          name: 'My Life is in Ruins!',
          link: '',
          hints: [
            
          ]
        },
        {
          name: 'The Inside Scoop!',
          link: '',
          hints: [
            
          ]
        },
        {
          name: 'Meta-Puzzle',
          link: '',
          hints: [
            
          ]
        }
      ],
      '2016': [
        {
          name: 'Cite Unseen',
          link: 'Cite-Unseen.pdf',
          hints: [
            
          ],
          codeWord: 'Lewis Carroll'
        },
        {
          name: 'Fold and Behold',
          link: 'Fold-and-Behold.pdf',
          hints: [
            
          ],
          codeWord: 'Hiccup'
        },
        {
          name: 'Stop the Clock',
          link: 'Stop-the-Clock.pdf',
          hints: [
            
          ],
          codeWord: 'Google'
        },
        {
          name: 'Time will Tell',
          link: 'Time-will-Tell.pdf',
          hints: [
            
          ]
        }
      ],
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
          </Grid>
          { this._puzzles() }
          <Image fluid src="/img/2016/event-photos/team-the-purple-penguins-thin.jpg"/>
        </Segment>
       </Container>
    )
  }

  _puzzles() {
    const { activeIndex } = this.state;
    let ridx = 0
    return Object.keys(this.puzzles).map((year) => (
      <Segment basic>
      <Header as='h1'>{year}</Header>
        { this.puzzles[year].map((puzzle, j) => (
          <Accordion styled fluid>
            <Accordion.Title active={activeIndex === ridx} index={ridx} onClick={(e,p) => this.handleClick(e,p)} >
              <Icon color="black" size="huge" name="dropdown"/>
              {j+1}. {puzzle.name}
            </Accordion.Title>
            <Accordion.Content active={activeIndex === ridx++}>
              <Grid padded stackable centered textAlign="left">
                <Grid.Row centered columns={4}>
                  <Grid.Column>
                    <Segment padded inverted color='blue'>
                      <Header as='h2'>Puzzle</Header>
                      <Button as='a' target='_blank' href={`/puzzles/${year}/${puzzle.link}`} content='Download'/>
                    </Segment>
                  </Grid.Column>
                  <Grid.Column>
                    <Segment padded inverted color='blue'>
                      <Header as='h2'>Hints</Header>
                      <List relaxed>
                        { puzzle.hints.map((file, k) => (
                          <List.Item>
                            {k+1}. <Button as='a' target='_blank' href={file} content='Download'/>
                          </List.Item>
                        )) }
                      </List>
                    </Segment>
                  </Grid.Column>
                  <Grid.Column>
                    <Segment padded inverted color='blue'>
                      <Header as='h2'>Code Word</Header>
                      <p className="codeWord" id={"codeWord" + year + j} >{ puzzle.codeWord }</p>
                      <Button id={"codeWord" + year + j + "button"} as='button' onClick={() => this.revealCode("codeWord" + year + j)} content="Reveal" />
                    </Segment>
                  </Grid.Column>
                  <Grid.Column>
                    <Segment padded inverted color='blue'>
                      <Header as='h2'>Walkthrough</Header>
                      <p>Coming soon!</p>
                    </Segment>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Accordion.Content>
          </Accordion>
        )) }
      </Segment>      
    ));
      
  }

  handleClick(e, titleProps) {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = (activeIndex === index) ? -1 : index;
    this.setState({ activeIndex: newIndex });
  }

  revealCode(id) {
    let text = document.getElementById(id);
    text.classList.remove("codeWord");
  }
}