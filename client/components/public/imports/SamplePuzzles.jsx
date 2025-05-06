import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Grid, Card, Container, Segment, Header, Button, Icon, Image, Accordion, List } from 'semantic-ui-react';

export default class SamplePuzzles extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.puzzles = {
      '2024': {
        extra: (
          <div>
            <Header as='h2'>Message from Millie:</Header>
            <p className='h4'> Thank you for participating!
            I understand that the puzzles were on the difficult side this year. Once again, I sincerely apologize. My intent is always to create curiosity, interest, and a jumping-off point for a learning experience, not to demean or frustrate you (for that breaks my heart). Please have a look at the walk-throughs and I will keep trying harder. Millie</p>
            <br />
          </div>
        ),
        puzzles: [
          {
            name: 'Worthy Caws!',
            link: 'https://gph-distributed.s3.us-west-2.amazonaws.com/2024/puzzles/caws/puzzle-D1DD71E6-7475-4D3D-A2BE-0F2BE4D90CFF.pdf',
            hints: [
              'https://gph-distributed.s3.us-west-2.amazonaws.com/2024/puzzles/caws/h1-81FC4834-519B-41FE-BE3A-93B92230C783.jpg',
              'https://gph-distributed.s3.us-west-2.amazonaws.com/2024/puzzles/caws/h2CA295D52-6774-4F61-A1CD-78958A32A0E8.jpg',
              'https://gph-distributed.s3.us-west-2.amazonaws.com/2024/puzzles/caws/h3-F878EF6A-0F08-4667-8D90-364470C0DFC1.jpg'
            ],
            codeWord: 'cherami',
            walkthrough: 'https://gph-distributed.s3.us-west-2.amazonaws.com/2024/puzzles/caws/1.Walk-Through+Solution+WORTHY+CAWS2024.pdf'
          },
          {
            name: 'Hue-Dunnit!',
            link: 'https://gph-distributed.s3.us-west-2.amazonaws.com/2024/puzzles/hue/puzzle-4D662959-0800-493A-9635-3BA19BCA8223.pdf',
            hints: [
              'https://gph-distributed.s3.us-west-2.amazonaws.com/2024/puzzles/hue/h1-1B081C32-0700-4B8B-A990-4642864049BF.png',
              'https://gph-distributed.s3.us-west-2.amazonaws.com/2024/puzzles/hue/h2-27CBC56A-F101-4373-BD8D-A91D2167B0E3.png',
              'https://gph-distributed.s3.us-west-2.amazonaws.com/2024/puzzles/hue/h3-98CA0567-1FDD-41E8-B5F9-B79477569093.png'
            ],
            codeWord: 'ignatzsbrick',
            walkthrough: 'https://gph-distributed.s3.us-west-2.amazonaws.com/2024/puzzles/hue/2.Walk-Through+Solution+HUE-DUNNIT2024.pdf'
          },
          {
            name: 'Clef-Hanger!',
            link: 'https://gph-distributed.s3.us-west-2.amazonaws.com/2024/puzzles/clef/puzzle-E6A81E51-DD49-4184-B207-567E49593FC5.pdf',
            hints: [
              'https://gph-distributed.s3.us-west-2.amazonaws.com/2024/puzzles/clef/h1-A283FD3F-306C-4DD5-AA48-407571198E84.jpg',
              'https://gph-distributed.s3.us-west-2.amazonaws.com/2024/puzzles/clef/h2-4CC1BF41-3B00-4C45-A607-526E6E33F98B.jpg',
              'https://gph-distributed.s3.us-west-2.amazonaws.com/2024/puzzles/clef/h3-10B80358-F46E-4A74-8515-A904EEBD43A8.jpg'
            ],
            codeWord: 'dogfur',
            walkthrough: 'https://gph-distributed.s3.us-west-2.amazonaws.com/2024/puzzles/clef/3.Walk-Through+CLEF-HANGER2024.pdf'
          },
          {
            name: 'Siriusly?!',
            link: 'https://gph-distributed.s3.us-west-2.amazonaws.com/2024/puzzles/siriusly/puzzle-5E69F5E7-B7B6-466C-82D6-2EDEB0662971.pdf',
            hints: [
              'https://gph-distributed.s3.us-west-2.amazonaws.com/2024/puzzles/siriusly/h1-C04EDBFE-A178-46EF-A75E-CBA1D3E18A39.jpg',
              'https://gph-distributed.s3.us-west-2.amazonaws.com/2024/puzzles/siriusly/h2-AEA8D5B6-ECE3-47EA-A459-84A3E6E1670E.jpg',
              'https://gph-distributed.s3.us-west-2.amazonaws.com/2024/puzzles/siriusly/h3-7EF48A93-738F-4D72-B6D7-66A531BF6533.jpg'
            ],
            codeWord: 'lawyers',
            walkthrough: 'https://gph-distributed.s3.us-west-2.amazonaws.com/2024/puzzles/siriusly/4.Walk-Through+Solution+SIriusly2024.pdf'
          },
          {
            name: 'Meta-Puzzle',
            link: 'https://gph-distributed.s3.us-west-2.amazonaws.com/2024/puzzles/meta/puzzle-6DA8923D-16E8-4034-9B27-5DDE62B89B9A.pdf',
            hints: [],
            codeWord: 'thecircleoflife',
            walkthrough: 'https://gph-distributed.s3.us-west-2.amazonaws.com/2024/puzzles/meta/5.Walk-Through+Solution+Meta-Puzzle+2024.pdf'
          }
        ]
      },
      '2023': {
        puzzles: [
          {
            name: 'May the Forest be with You!',
            link: 'https://gph-distributed.s3.us-west-2.amazonaws.com/2023/puzzles/forest/forest-4449A0B3-0B68-4E6E-9FFE-A60F71D4E83D.pdf',
            hints: [
              'https://gph-distributed.s3.us-west-2.amazonaws.com/2023/puzzles/forest/h1-C86D9A9B-235C-4F9F-AB75-FBF5DD19EE41.png',
              'https://gph-distributed.s3.us-west-2.amazonaws.com/2023/puzzles/forest/h2-E9ED2D08-AC23-4796-98D1-692539B02459.png',
              'https://gph-distributed.s3.us-west-2.amazonaws.com/2023/puzzles/forest/h3-A88B264E-5A74-4F5F-A8CC-0EBB52BC8B29.png'
            ],
            codeWord: 'coach beard',
            walkthrough: 'https://gph-distributed.s3.us-west-2.amazonaws.com/2023/puzzles/forest/1.Walk-Through+Solution+May+the+Forest+be+with+You.pdf' 
          },
          {
            name: 'Once a Pawn a Time!',
            link: 'https://gph-distributed.s3.us-west-2.amazonaws.com/2023/puzzles/pawn/pawn-C12B1FB4-EAF1-42C0-ABAB-710E3419098A.pdf',
            hints: [
              'https://gph-distributed.s3.us-west-2.amazonaws.com/2023/puzzles/pawn/h1-FE48F5C9-07E1-4F80-A5E7-330B0A577776.png',
              'https://gph-distributed.s3.us-west-2.amazonaws.com/2023/puzzles/pawn/h2-DB248C96-2269-4464-A92B-4E4E82725AB3.png',
              'https://gph-distributed.s3.us-west-2.amazonaws.com/2023/puzzles/pawn/h3-B0FA2A68-110F-48BD-99E3-B067C8B33BF9.png'
            ],
            codeWord: 'maelzel\'s chess player',
            walkthrough: 'https://gph-distributed.s3.us-west-2.amazonaws.com/2023/puzzles/pawn/4.Walk-Through+Solution+Once+a+Pawn+a+Time.pdf'
          },
          {
            name: 'The Sound of Silence!',
            link: 'https://gph-distributed.s3.us-west-2.amazonaws.com/2023/puzzles/silence/silence-3B5C2D8A-1398-4E73-869B-48AA162501C3.pdf',
            hints: [
              'https://gph-distributed.s3.us-west-2.amazonaws.com/2023/puzzles/silence/h1-B7573EEC-5D66-41E8-ADB3-0B546CF5B632.png',
              'https://gph-distributed.s3.us-west-2.amazonaws.com/2023/puzzles/silence/h2-DE77456C-5A6C-4C96-8A02-1B1ACF884645.png',
              'https://gph-distributed.s3.us-west-2.amazonaws.com/2023/puzzles/silence/h3-3CDC2870-F7D6-44A7-8D61-244D9A312245.png'
            ],
            codeWord: 'get along',
            walkthrough: 'https://gph-distributed.s3.us-west-2.amazonaws.com/2023/puzzles/silence/2.Walk-Through+Solution+The+Sound+of+Silence.pdf'
          },
          {
            name: 'Give it a Whorl!',
            link: 'https://gph-distributed.s3.us-west-2.amazonaws.com/2023/puzzles/whorl/whorl-9E07BCF4-B566-4875-99E1-938A85A4A841.pdf',
            hints: [
              'https://gph-distributed.s3.us-west-2.amazonaws.com/2023/puzzles/whorl/Give+Whorl+Hint1.Corrected.PNG',
              'https://gph-distributed.s3.us-west-2.amazonaws.com/2023/puzzles/whorl/h2-3D0EA7D6-8F7F-4CF1-B7F7-908A4F6FA7E9.png',
              'https://gph-distributed.s3.us-west-2.amazonaws.com/2023/puzzles/whorl/h3-9FB9802F-8317-4C70-8CA3-9CC3F2345F58.png'
            ],
            codeWord: 'the partridge family',
            walkthrough: 'https://gph-distributed.s3.us-west-2.amazonaws.com/2023/puzzles/whorl/3.Walk-Through+Solution+Give+it+a+Whorl.pdf'
          },
          {
            name: 'Meta-Puzzle',
            link: 'https://gph-distributed.s3.us-west-2.amazonaws.com/2023/puzzles/meta/meta-F8012121-E334-4DB3-8ABE-43E093757927.pdf',
            hints: [],
            codeWord: 'a charged tale',
            walkthrough: 'https://gph-distributed.s3.us-west-2.amazonaws.com/2023/puzzles/meta/5.Walk-Through+Solution+Meta+2023+Puzzle+Walk.pdf'
          },
        ]
      },
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
    return Object.keys(this.puzzles).sort((a, b) => b - a).map((year) => (
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
