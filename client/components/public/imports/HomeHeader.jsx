import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { Scrollchor } from 'react-scrollchor';
import YouTube from 'react-youtube';
import { Grid, Container, Segment, Icon, Message, Button } from 'semantic-ui-react';
import moment from 'moment';

import LinkButton from '../../imports/LinkButton';
import TimedComp from './TimedComp';
import GamestateComp from '../../imports/GamestateComp'

const { eventYear, eventDate, eventDay, earlyBirdLastDate, registrationCloseDate } = Meteor.settings.public;

/* TODO: these two components should be on timers, and the official times should be
   stored in a well-known place with a well known (ISO 8601, anyone?) format. */
let link = `https://commerce.cashnet.com/TheGreatPuzzleHunt${eventYear}`;

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
      you can still <a href={link} target="_blank">buy and redeem tickets</a> until 10:00 AM {eventDay}, {eventDate}.
    </Message.Content>
  </Message>
);

class HomeHeader extends Component {
  updateDimensions() {
    this.forceUpdate();
  }
  render() {
    let videoHeight = Math.max(700, window.innerWidth * 9 / 16);
    let videoWidth = videoHeight * 16 / 9;

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
          <div className="header-wrap">
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
                  <div id="header-video-content" style={{zIndex: "2", position: "absolute", width: "100%", height: "calc(100% - 100px)", display: "flex", flexDirection: "column", justifyContent: "center", transform: "translateZ(1px)"}}>
                    <h1 className="header-text text-highlight-color">WWU Seventh Annual</h1>
                    <h1 className="header-text gigantic">Great Puzzle Hunt</h1>
                    <h2 className="sub-header-text">{eventDay}, {eventDate} 9:30 AM</h2>
                    { this._linkButtons() }
                    <h3 style={{color: "white", textAlign: "center"}}>
                      This event is made possible thanks to
                      <Scrollchor
                        to="#sponsors"
                        style={{color: "#bad80a"}}
                        animate={{offset:-60, duration:800}}><strong> our Awesome Sponsors</strong>
                      </Scrollchor>
                    </h3>
                  </div>
                  { this._socialMediaButtons()}
                  
                </div>
          </div>

      </section>
    );
  }

  _linkButtons() {
    const gamestate = this.props.gamestate || {};

    const registerButton = (
      <Scrollchor
        to="#home-registration"
        animate={{offset:-60, duration:800}}>
        <Button size="huge" color="blue" content="Register Now!"/>
      </Scrollchor>
      
    );

    const leaderboardButton = (
      <LinkButton to="/leaderboard" size='huge' color='yellow' content='Leader Board'
        icon={<Icon name="trophy" />}
      />
    );
    const buyGearButton = (
      <LinkButton as='a' href="/gear"
        size="huge" color="orange" target="_blank"
        icon={<Icon name="shopping cart" />}
        content="Buy Gear"
      />
    );

    const donateButton = (
      <LinkButton as='a' href="https://foundation.wwu.edu/greatpuzzlehunt"
        size='huge'
        color="green"
        icon={<Icon name='heart'/>}
        content='Donate'
      />
    );

    return (
      <div>
        <div style={{position: "relative", bottom: "0", width:"100%", display: "flex", justifyContent: "center"}}>
          { registerButton }

          { gamestate.leaderboard ? <div>{leaderboardButton}</div> : null }

          { gamestate.buyGear ? buyGearButton : null }
          
          {donateButton}
        </div>
        
        {/* <LinkButton to="/login" size='huge' content='Log In'/> */}

        {/* {registrationClosesMessage} */}

        

        {/* <LinkButton to="/faq" size="large" content="FAQ" /> */}
        
      </div>
    );
  }

  _socialMediaButtons() {
    const facebookButton = (
    <a href="https://www.facebook.com/greatpuzzlehunt/">
      <img height="40px" src="/img/glyphs/facebook-glyph.png" />
    </a>
    );
    const instagramButton = (
    <a href="https://www.instagram.com/greatpuzzlehunt/">
      <img height="40px" src="/img/glyphs/instagram-glyph.png" />
    </a>
    );
    const youtubeButton = (
    <a  href="https://www.youtube.com/channel/UCTc814_FbilFiSVktIWec8A">
      <img height="40px" src="/img/glyphs/youtube-glyph.png" />
    </a>
    );

    return (
      <div className="social-media-buttons" style={{padding: "10px"}}>
        {facebookButton}
        {instagramButton}
        {youtubeButton}
      </div>
    )
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
