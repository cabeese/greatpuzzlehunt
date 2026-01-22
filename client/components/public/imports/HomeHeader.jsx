import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { Scrollchor } from 'react-scrollchor';
import YouTube from 'react-youtube';
import { Grid, Container, Segment, Icon, Message, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import moment from 'moment';

import LinkButton from '../../imports/LinkButton';
import TimedComp from './TimedComp';
import GamestateComp from '../../imports/GamestateComp'

const { eventYear, eventDate, eventDay, earlyBirdLastDate, registrationCloseDate } = Meteor.settings.public;

/* TODO: these two components should be on timers, and the official times should be
   stored in a well-known place with a well known (ISO 8601, anyone?) format. */
let cashnet_link = `https://commerce.cashnet.com/TheGreatPuzzleHunt${eventYear}`;

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
      you can still <a href={cashnet_link} target="_blank">buy and redeem tickets</a> until 10:00 AM {eventDay}, {eventDate}.
    </Message.Content>
  </Message>
);

class HomeHeader extends Component {
  updateDimensions() {
    this.forceUpdate();
  }
  render() {
    let opts = {
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
		  <div id="video-mask">
                      <YouTube
			  opts={opts}
			  videoId={"paBGQzMCdUo"}
			  id={"player"}
			  onReady={this.playVideo}
			  onEnd={this.playVideo}
			  containerClassName={"video-iframe-container"}>
                      </YouTube>
		  </div>
                    <div id="header-video-content">
		      <h1 className="header-text text-highlight-color">WWU Tenth Annual</h1>
		      <h1 className="header-text gigantic">Great Puzzle Hunt</h1>
		      <h2 className="sub-header-text">
			<em>HYBRID EVENT: IN-PERSON OR VIRTUAL</em><br />
			{eventDay}, {eventDate} 9:30 AM
		      </h2>
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
      <LinkButton
        to="/register"
        size="huge" color="blue" content="Register Now!" />
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
      <LinkButton as='a'
		  href={ gamestate.givingURL ? gamestate.givingURL : "https://foundation.wwu.edu/greatpuzzlehunt" }
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
    function SMButton(siteName, url) {
      const color = siteName === "reddit" ? "red" : ( siteName === 'discord' ? "violet" : siteName);
      return <Button
              color={color}
              circular
              as='a'
              target='_blank'
              href={url}
              icon={<Icon name={siteName}/>}
        />
    };

    return (
      <div className="social-media-buttons" style={{padding: "10px"}}>
        {SMButton("facebook", "https://www.facebook.com/greatpuzzlehunt/")}
        {SMButton("instagram", "https://www.instagram.com/wwu.greatpuzzlehunt/")}
        {SMButton("reddit", "https://www.reddit.com/user/gph_official")}
        {SMButton("youtube", "https://www.youtube.com/channel/UCTc814_FbilFiSVktIWec8A")}
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
