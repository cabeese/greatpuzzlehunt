import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Grid, Card, Container, Segment, Header, Button, Icon, Image, Accordion, List } from 'semantic-ui-react';

export default class SamplePuzzles extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.puzzles = {
      '2022': {
        puzzles: [
          {
            name: 'Shark – Loan or Pool? Chews Wisely!',
            link: 'https://gph-distributed.s3.us-west-2.amazonaws.com/2022/shark/shark-b005d73b-1256-441c-adf8-74e2a8f25ecc.pdf',
            hints: [
              'https://gph-distributed.s3.us-west-2.amazonaws.com/2022/shark/h1-6f0d91db-bea2-43e0-8ecf-5a726ce88d32.JPG',
              'https://gph-distributed.s3.us-west-2.amazonaws.com/2022/shark/h2-0ace70dc-9be5-4320-b723-a2997844ea43.JPG',
              'https://gph-distributed.s3.us-west-2.amazonaws.com/2022/shark/h3-edfe4c17-ec99-4a0f-88e1-857681c0ddb1.JPG'
            ],
            codeWord: 'duchess of doom',
            walkthrough: 'https://gph-distributed.s3.us-west-2.amazonaws.com/2022/shark/1.Walk-Through+Solution+Shark-Loan+or+Pool+Chews+Wisely.pdf'
          },
          {
            name: 'Operation Ship Shape!',
            link: 'https://gph-distributed.s3.us-west-2.amazonaws.com/2022/ship/ship-5d5706bd-7e09-4c9a-8d69-59c658029296.pdf',
            hints: [
              'https://gph-distributed.s3.us-west-2.amazonaws.com/2022/ship/h1-1b2565de-0ffc-4d6b-baf8-c626ce7541a7.JPG',
              'https://gph-distributed.s3.us-west-2.amazonaws.com/2022/ship/h2-b3a2dd06-81cf-47f7-8e9f-1241792bf0d2.JPG',
              'https://gph-distributed.s3.us-west-2.amazonaws.com/2022/ship/h3-9a777cc0-0c6e-4106-8e4c-26faf299ffc9.JPG'
            ],
            codeWord: 'uss olympia',
            walkthrough: 'https://gph-distributed.s3.us-west-2.amazonaws.com/2022/ship/2.Walk-Through+Solution-Operation+Ship+Shape.pdf'
          },
          {
            name: 'Go for Baroque!',
            link: 'https://gph-distributed.s3.us-west-2.amazonaws.com/2022/baroque/baroque-bc9c3bc7-4795-42f0-8e90-17813b5a1309.pdf',
            hints: [
              'https://gph-distributed.s3.us-west-2.amazonaws.com/2022/baroque/h1-9f6fb206-9b67-495e-8bdc-e0cbe925185a.JPG',
              'https://gph-distributed.s3.us-west-2.amazonaws.com/2022/baroque/h2-451d4fe4-5ddd-47c3-98f5-0c0dc77314f7.JPG',
              'https://gph-distributed.s3.us-west-2.amazonaws.com/2022/baroque/h3-a13f72b4-e0d0-46bf-b3f9-bd5f95dea48e.JPG'
            ],
            codeWord: 'fourth',
            walkthrough: 'https://gph-distributed.s3.us-west-2.amazonaws.com/2022/baroque/3.Walk-Through+Solution-Go+for+Baroque.pdf'
          },
          {
            name: 'Trade Secret!',
            link: 'https://gph-distributed.s3.us-west-2.amazonaws.com/2022/trade/trade-ad96c1e8-681e-4a9c-a583-5ba006afc040.pdf',
            hints: [
              'https://gph-distributed.s3.us-west-2.amazonaws.com/2022/trade/h1-3eca0f61-9ebc-48d6-ac9d-9dce31a1cb73.JPG',
              'https://gph-distributed.s3.us-west-2.amazonaws.com/2022/trade/h2-85419144-f834-4db0-ba04-799be50655b7.JPG',
              'https://gph-distributed.s3.us-west-2.amazonaws.com/2022/trade/h3-25345ff6-f175-4006-90cc-2da40ef95e44.JPG'
            ],
            codeWord: 'rear view mirror',
            walkthrough: 'https://gph-distributed.s3.us-west-2.amazonaws.com/2022/trade/4.Walk-Through+Solution-Trade+Secret.pdf'
          },
          {
            name: 'Meta Puzzle',
            link: 'https://gph-distributed.s3.us-west-2.amazonaws.com/2022/meta/meta-c9cd6144-7f94-4c44-b1f0-3ac34ed65d4a.pdf',
            hints: [],
            codeWord: 'let\'s party',
            walkthrough: 'https://gph-distributed.s3.us-west-2.amazonaws.com/2022/meta/5.Walk-Through+Solution-Meta-Puzzle.pdf'
          }
        ]
      },
      '2021': {
        inspiration: 'https://gph-distributed.s3-us-west-2.amazonaws.com/2021/_solutions/0.READ_ME_FIRST+v5-2021.pdf',
        extra: (
          <div>
          <Header as='h2'>Apology</Header>
          <p className='h4'>The puzzles were more challenging than intended this year. Like all of you, I have been isolated for over a year. Working in a vacuum, I missed the mark on some hints and the amount of time needed in a virtual environment. The goal was to provide a fun, free, safe opportunity for anyone to play and puzzle for the day. I hope that you might still enjoy playing with the puzzles after the event.</p>
          <br />
          </div>
        ),
        infoPacket: 'https://gph-distributed.s3-us-west-2.amazonaws.com/2021/2021_infopacket.pdf',
        puzzles: [
          {
            name: 'Scents and Scents-Ability!',
            link: 'https://gph-distributed.s3-us-west-2.amazonaws.com/2021/scents/P-9924857B-5FFC-4B57-9CBC-DF27D5422C77.pdf',
            hints: [
              "https://gph-distributed.s3-us-west-2.amazonaws.com/2021/scents/1-37469FD1-51AA-480B-BC4D-CEF6F884B4D2.JPG",
              "https://gph-distributed.s3-us-west-2.amazonaws.com/2021/scents/2-C4D8CF79-F6AF-4F15-9DB7-A38E8A3DB4A0.JPG",
              "https://gph-distributed.s3-us-west-2.amazonaws.com/2021/scents/3-5B64AAAA-04E7-4613-BFAB-73D845E4D056.JPG"
            ],
            codeWord: 'royal jelly',
            walkthrough: 'https://gph-distributed.s3-us-west-2.amazonaws.com/2021/_solutions/1Scents_and_Scents-Ability_Walk-Through.pdf'
          },
          {
            name: 'Dough, a Dear!',
            link: 'https://gph-distributed.s3-us-west-2.amazonaws.com/2021/dough/P-38962021-AE8B-4DA7-B1F0-EDA0D6C97AB4.pdf',
            hints: [
              "https://gph-distributed.s3-us-west-2.amazonaws.com/2021/dough/1-1A2DBA26-3070-4AAD-BCE7-F34E125F4513.JPG",
              "https://gph-distributed.s3-us-west-2.amazonaws.com/2021/dough/2-BE4D6721-F263-41A3-979F-7825715A8CD6.JPG",
              "https://gph-distributed.s3-us-west-2.amazonaws.com/2021/dough/3-56766A65-949D-46BF-9C54-E51628ED7A79.JPG"
            ],
            codeWord: 'all you need is love',
            walkthrough: 'https://gph-distributed.s3-us-west-2.amazonaws.com/2021/_solutions/2Dough_a_Dear_Walk-Through.pdf'
          },
          {
            name: 'My Life is in Ruins!',
            link: 'https://gph-distributed.s3-us-west-2.amazonaws.com/2021/ruins/P-58C9DC66-87A7-4597-A3B0-7772E7D6E01C.pdf',
            hints: [
              "https://gph-distributed.s3-us-west-2.amazonaws.com/2021/ruins/1-70DCDD2D-13B1-422B-AE7B-B6F3B2BADA33.JPG",
              "https://gph-distributed.s3-us-west-2.amazonaws.com/2021/ruins/2-C2A5279D-53DC-4F31-B548-19A36DB36171.JPG",
              "https://gph-distributed.s3-us-west-2.amazonaws.com/2021/ruins/3-F2385B41-56C9-4E2B-A9A0-E5C72C19668A.JPG"
            ],
            codeWord: 'sarah parcak',
            walkthrough: 'https://gph-distributed.s3-us-west-2.amazonaws.com/2021/_solutions/3My_Life_is_in_Ruins_Walk-Through.pdf'
          },
          {
            name: 'The Inside Scoop!',
            link: 'https://gph-distributed.s3-us-west-2.amazonaws.com/2021/scoop/P-E0E902A2-A881-4551-969D-4ED1FB6959A5.pdf',
            hints: [
              "https://gph-distributed.s3-us-west-2.amazonaws.com/2021/scoop/1-E52FEBCF-71B6-4F8B-98AE-2498154DE10E.JPG",
              "https://gph-distributed.s3-us-west-2.amazonaws.com/2021/scoop/2-DB3E6A12-BBE7-4603-88E8-0CCB649A13E1.JPG",
              "https://gph-distributed.s3-us-west-2.amazonaws.com/2021/scoop/3-3597E9ED-E3BE-4A7A-905E-0F2B4B8F4C77.JPG"
            ],
            codeWord: 'microcosm',
            walkthrough: 'https://gph-distributed.s3-us-west-2.amazonaws.com/2021/_solutions/4The_Inside_Scoop_Walk-Through.pdf'
          },
          {
            name: 'Meta-Puzzle',
            link: 'https://gph-distributed.s3-us-west-2.amazonaws.com/2021/meta/MP-1DEAEA4C-DBA4-4F10-92AD-7C8501C52A83.pdf',
            hints: [],
            codeWord: 'it\'s a small world',
            walkthrough: 'https://gph-distributed.s3-us-west-2.amazonaws.com/2021/_solutions/5Meta-Puzzle_Walk-Through.pdf'
          }
        ]
      },
      '2016': {
        infoPacket: '/puzzles/2016/2016_infopacket.pdf',
        puzzles: [
          {
            name: 'Cite Unseen',
            link: '/puzzles/2016/Cite-Unseen.pdf',
            hints: [
              '/puzzles/2016/Hint1CiteUnseen.jpg',
              '/puzzles/2016/Hint2CiteUnseen.jpg',
              '/puzzles/2016/Hint3CiteUnseen.jpg'
            ],
            codeWord: 'Lewis Carroll'
          },
          {
            name: 'Fold and Behold',
            link: '/puzzles/2016/Fold-and-Behold.pdf',
            hints: [
              '/puzzles/2016/Hint1FoldBehold.jpg',
              '/puzzles/2016/Hint2FoldBehold.jpg',
              '/puzzles/2016/Hint3FoldBehold.jpg'
            ],
            codeWord: 'Hiccup'
          },
          {
            name: 'Stop the Clock',
            link: '/puzzles/2016/Stop-the-Clock.pdf',
            hints: [
              '/puzzles/2016/Hint1StoptheClock.jpg',
              '/puzzles/2016/Hint2StoptheClock.jpg',
              '/puzzles/2016/Hint3StoptheClock.jpg'
            ],
            codeWord: 'Google'
          },
          {
            name: 'Time will Tell',
            link: '/puzzles/2016/Time-will-Tell.pdf',
            hints: [
              '/puzzles/2016/Hint1TimeTell.jpg',
              '/puzzles/2016/Hint2TimeTell.jpg',
              '/puzzles/2016/Hint3TimeTell.jpg'
            ],
            codeWord: 'Beethoven'
          }
        ]
      },
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
                <p className='h4'>Below you can find some of the past Puzzles. Download them and try to solve them for yourself!</p>
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
      <Segment basic key={year}>
      <Header as='h1'>{year}</Header>
        { this.puzzles[year].extra ? this.puzzles[year].extra : null }
        { this.puzzles[year].infoPacket ? <><span className='h4'>Info Packet: </span><Button as='a' target='_blank' href={this.puzzles[year].infoPacket} content='Download'/></> : null }
        { this.puzzles[year].inspiration ? 
          <span className='h4'><br />Puzzle Inspiration (Contains spoilers): <Button as='a' target='_blank' href={this.puzzles[year].inspiration} content="Download"/></span>
        : null }
        { this.puzzles[year].puzzles.map((puzzle, j) => (
          <Accordion styled fluid key={year+j}>
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
                      <Button as='a' target='_blank' href={puzzle.link} content='Download'/>
                    </Segment>
                  </Grid.Column>
                  <Grid.Column>
                    <Segment padded inverted color='blue'>
                      <Header as='h2'>Hints</Header>
                      <List relaxed >
                        { puzzle.hints.length ? puzzle.hints.map((file, k) => (
                          <List.Item key={year+j+k}>
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
                    { puzzle.walkthrough ?
                    <Segment padded inverted color='blue'>
                      <Header as='h2'>Walkthrough</Header>
                        <Button as='a' target='_blank' href={puzzle.walkthrough} content="Download"/>
                    </Segment>
                    : null }
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
