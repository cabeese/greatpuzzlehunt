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
          link: 'https://gph-distributed.s3-us-west-2.amazonaws.com/2021/scents/P-9924857B-5FFC-4B57-9CBC-DF27D5422C77.pdf',
          hints: [
            "https://gph-distributed.s3-us-west-2.amazonaws.com/2021/scents/1-37469FD1-51AA-480B-BC4D-CEF6F884B4D2.JPG",
            "https://gph-distributed.s3-us-west-2.amazonaws.com/2021/scents/2-C4D8CF79-F6AF-4F15-9DB7-A38E8A3DB4A0.JPG",
            "https://gph-distributed.s3-us-west-2.amazonaws.com/2021/scents/3-5B64AAAA-04E7-4613-BFAB-73D845E4D056.JPG"
          ],
          codeWord: 'royal jelly'
        },
        {
          name: 'Dough, a Dear!',
          link: 'https://gph-distributed.s3-us-west-2.amazonaws.com/2021/dough/P-38962021-AE8B-4DA7-B1F0-EDA0D6C97AB4.pdf',
          hints: [
            "https://gph-distributed.s3-us-west-2.amazonaws.com/2021/dough/1-1A2DBA26-3070-4AAD-BCE7-F34E125F4513.JPG",
            "https://gph-distributed.s3-us-west-2.amazonaws.com/2021/dough/2-BE4D6721-F263-41A3-979F-7825715A8CD6.JPG",
            "https://gph-distributed.s3-us-west-2.amazonaws.com/2021/dough/3-56766A65-949D-46BF-9C54-E51628ED7A79.JPG"
          ],
          codeWord: 'all you need is love'
        },
        {
          name: 'My Life is in Ruins!',
          link: 'https://gph-distributed.s3-us-west-2.amazonaws.com/2021/ruins/P-58C9DC66-87A7-4597-A3B0-7772E7D6E01C.pdf',
          hints: [
            "https://gph-distributed.s3-us-west-2.amazonaws.com/2021/ruins/1-70DCDD2D-13B1-422B-AE7B-B6F3B2BADA33.JPG",
            "https://gph-distributed.s3-us-west-2.amazonaws.com/2021/ruins/2-C2A5279D-53DC-4F31-B548-19A36DB36171.JPG",
            "https://gph-distributed.s3-us-west-2.amazonaws.com/2021/ruins/3-F2385B41-56C9-4E2B-A9A0-E5C72C19668A.JPG"
          ],
          codeWord: 'sarah parcak'
        },
        {
          name: 'The Inside Scoop!',
          link: 'https://gph-distributed.s3-us-west-2.amazonaws.com/2021/scoop/P-E0E902A2-A881-4551-969D-4ED1FB6959A5.pdf',
          hints: [
            "https://gph-distributed.s3-us-west-2.amazonaws.com/2021/scoop/1-E52FEBCF-71B6-4F8B-98AE-2498154DE10E.JPG",
            "https://gph-distributed.s3-us-west-2.amazonaws.com/2021/scoop/2-DB3E6A12-BBE7-4603-88E8-0CCB649A13E1.JPG",
            "https://gph-distributed.s3-us-west-2.amazonaws.com/2021/scoop/3-3597E9ED-E3BE-4A7A-905E-0F2B4B8F4C77.JPG"
          ],
          codeWord: 'microcosm'
        },
        {
          name: 'Meta-Puzzle',
          link: 'https://gph-distributed.s3-us-west-2.amazonaws.com/2021/meta/MP-1DEAEA4C-DBA4-4F10-92AD-7C8501C52A83.pdf',
          hints: [],
          codeWord: 'it\'s a small world'
        }
      ],
      '2016': [
        {
          name: 'Cite Unseen',
          link: 'Cite-Unseen.pdf',
          hints: [
            '/puzzles/2016/Hint1CiteUnseen.jpg',
            '/puzzles/2016/Hint2CiteUnseen.jpg',
            '/puzzles/2016/Hint3CiteUnseen.jpg'
          ],
          codeWord: 'Lewis Carroll'
        },
        {
          name: 'Fold and Behold',
          link: 'Fold-and-Behold.pdf',
          hints: [
            '/puzzles/2016/Hint1FoldBehold.jpg',
            '/puzzles/2016/Hint2FoldBehold.jpg',
            '/puzzles/2016/Hint3FoldBehold.jpg'
          ],
          codeWord: 'Hiccup'
        },
        {
          name: 'Stop the Clock',
          link: 'Stop-the-Clock.pdf',
          hints: [
            '/puzzles/2016/Hint1StoptheClock.jpg',
            '/puzzles/2016/Hint2StoptheClock.jpg',
            '/puzzles/2016/Hint3StoptheClock.jpg'
          ],
          codeWord: 'Google'
        },
        {
          name: 'Time will Tell',
          link: 'Time-will-Tell.pdf',
          hints: [
            '/puzzles/2016/Hint1TimeTell.jpg',
            '/puzzles/2016/Hint2TimeTell.jpg',
            '/puzzles/2016/Hint3TimeTell.jpg'
          ],
          codeWord: 'Beethoven'
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
                        { puzzle.hints.length ? puzzle.hints.map((file, k) => (
                          <List.Item>
                            {k+1}. <Button as='a' target='_blank' href={file} content='Download'/>
                          </List.Item>
                        )) : "No hints for this one!" }
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