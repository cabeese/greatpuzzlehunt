import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import Scrollchor from 'react-scrollchor';
import YouTube from 'react-youtube';
import { Grid, Container, Segment, Icon, Message, Button } from 'semantic-ui-react';
import moment from 'moment';

import LinkButton from '../../imports/LinkButton';
import TimedComp from './TimedComp';
import GamestateComp from '../../imports/GamestateComp'

const { eventDate, earlyBirdLastDate, registrationCloseDate } = Meteor.settings.public;

/* TODO: these two components should be on timers, and the official times should be
   stored in a well-known place with a well known (ISO 8601, anyone?) format. */

const registerNowMessage = (
  <Message icon color='teal'>
    <Icon name='ticket'/>
    <Message.Content>
      <Message.Header>Why Register Now?</Message.Header>
      All ticket and gear prices go up on {earlyBirdLastDate} at midnight!
    </Message.Content>
  </Message>
);

const registrationClosesMessage = (
  <Message icon color='yellow'>
    <Icon name='ticket'/>
    <Message.Content>
      <Message.Header>Why Register Now?</Message.Header>
      Step 1 of Registration Closes {registrationCloseDate}, 11:59 PM. <br/>
      Gear sales are closed, but
      you can still <a href="https://commerce.cashnet.com/TheGreatPuzzleHunt2019" target="_blank">buy and redeem tickets</a> until 10:00 AM {eventDate}.
    </Message.Content>
  </Message>
);

class HomeHeader extends Component {
  updateDimensions() {
    this.forceUpdate();
  }
  render() {
    let videoWidth = window.innerWidth;
    let videoHeight = videoWidth * 9 / 16;
    let maskHeight = Math.min(videoHeight, 600) + "px";
    let width = window.innerWidth;
    if (width < 930) {
      videoHeight = 560;
      videoWidth = videoHeight * 16 / 9;
      maskHeight = videoHeight + "px";
    }
    let opts = {
      height: videoHeight,
      width: videoWidth,
      playerVars: {
        rel: 0,
        autoplay: 1,
        controls: 0,
        showinfo: 0,
        autohide: 1,
        mute: 1,
        start: 6,
        end: 29,
        playsinline: 1
      }
    }
    return (
      <section id="home-header">
        <Grid stackable>
          
          <Grid.Row className="header-wrap">
                <div id="header-video-container">
                  <YouTube
                    opts={opts}
                    videoId={"paBGQzMCdUo"}
                    id={"player"}
                    onReady={this.playVideo}
                    onEnd={this.playVideo}
                    containerClassName={"video-mask"}
                    >
                  </YouTube>
                  <div id="header-video-content" style={{zIndex: "2", position: "absolute", top: "calc(29% + 100px)", width: "100%", transform: "translate3D(0, -50%, 1px)"}}>
                    <h1 className="header-text text-highlight-color">WWU Fifth Annual</h1>
                    <h1 className="header-text gigantic">Great Puzzle Hunt</h1>
                    <h2 className="sub-header-text">
                      {eventDate} <br/> 9:30 AM
                    </h2>
                    { this._linkButtons() }
                  </div>
                  
                </div>
          </Grid.Row>
          

          {/* <Grid.Row centered> */}
            {/* <Grid.Column width={5}> */}
              
            {/* </Grid.Column> */}
            {/* <Grid.Column width={3}>
              <Segment basic size='large' className="no-padding">
                Western Washington University<br/>
                516 High Street<br/>
                Bellingham, WA 98225<br/>
              </Segment>
            </Grid.Column> */}
          {/* </Grid.Row> */}

          

          {/* <Grid.Row centered>
            <Grid.Column width={16}>
              <h3>
                This event is made possible thanks to
                <Scrollchor
                  to="#sponsors"
                  animate={{offset:-60, duration:800}}><strong> our Awesome Sponsors</strong>
                </Scrollchor>
              </h3>
            </Grid.Column>
          </Grid.Row> */}

        </Grid>
      </section>
    );
  }

  _linkButtons() {
    const earlyBirdEnd = moment("2019-03-17T23:59:59-0700");
    const gamestate = this.props.gamestate || {};
    let ebMessage = "";
    if(moment() < earlyBirdEnd){
      ebMessage = registerNowMessage;
    }

    /* Buttons which may or may not appear, depending on gamestate */
    const leaderboardButton = (
      <LinkButton to="/leaderboard" size='huge' color='yellow' content='Leader Board'
        icon={<Icon name="trophy" />}
      />
    );
    const registerButton = (
      <LinkButton to='/register' size='huge' color='blue' content='Register Now!'/>
    );
    const buyGearButton = (
      <LinkButton as='a' href="https://www.wwu.edu/emarket/puzzlehunt/#design"
        size="large" color="blue" target="_blank"
        icon={<Icon name="shopping cart" />}
        content="Buy Gear"
      />
    );

    return (
      <div>
        {/* {ebMessage} */}
        <div style={{position: "relative", bottom: "0", width:"100%", display: "flex", justifyContent: "center"}}>
        { gamestate.leaderboard ? <div>{leaderboardButton}</div> : null }
        {registerButton}
        </div>
        
        {/* <LinkButton to="/login" size='huge' content='Log In'/> */}

        {/* {registrationClosesMessage} */}

        {/* { gamestate.buyGear ? buyGearButton : null } */}

        {/* <LinkButton to="/faq" size="large" content="FAQ" /> */}
        {/* <LinkButton as='a' href="https://alumni.wwu.edu/greatpuzzlehunt"
          size='large' color='green'
          icon={<Icon name='heart'/>}
          content='Donate'
        /> */}
      </div>
    );
  }

  componentDidMount() {
    window.addEventListener("resize", this.updateDimensions.bind(this));
  }
  playVideo(event) {
    event.target.seekTo(5);
    event.target.playVideo();
  }


}

HomeHeader = GamestateComp(HomeHeader);
export default HomeHeader
