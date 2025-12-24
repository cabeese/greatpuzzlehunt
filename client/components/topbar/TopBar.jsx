import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { Icon, Segment, Container } from 'semantic-ui-react';
import Scrollchor from 'react-scrollchor';

import { browserHistory } from '../../history';

import GamestateComp from '../imports/GamestateComp';
import { PuzzleHuntIcon, TreasureHuntIcon } from '../imports/PuzzleTreasureIcons';

const leaderboardLink = {
  name: 'Leaderboard',
  to: '/leaderboard',
  iconClass: 'yellow trophy',
};

const gearLink = {
  name: 'Gear',
  to: '/gear',
  iconClass: 'green dollar sign',
};


const mainMenuLinks = [
  {
    name: 'Sponsors',
    to: '/#sponsors',
    iconClass: 'green heart',
    custom: true,
  },
  {
    name: 'Teams',
    to: '/teams-list',
    iconClass: 'blue users',
  },
  {
    name: 'Contact',
    to: '/contact',
    iconClass: 'violet mail',
  },
  {
    name: 'Puzzles',
    to: '/puzzles',
    iconClass: 'red puzzle',
  },
  {
    name: 'FAQ',
    to: '/faq',
    iconClass: 'orange question',
  },
  {
    name: 'Rules of Play',
    to: '/rules',
    iconClass: 'teal circle info',
  },
  {
    name: 'Media',
    to: '/media',
    iconClass: 'olive camera',
  },
  {
    name: 'QR Encoder',
    to: '/qrcode',
    iconClass: 'grey qrcode',
  },
];

const adminMenuItems = [
  {
    name: 'Users',
    to: '/admin/users',
    iconClass: 'green users',
  },
  {
    name: 'Teams',
    to: '/admin/teams',
    iconClass: 'teal address book',
  },
  {
    name: 'Transactions',
    to: '/admin/transactions',
    iconClass: 'blue ticket',
  },
  {
    name: 'Leaderboard',
    to: '/leaderboard',
    iconClass: 'yellow trophy',
    key: 'adminLeaderboard',
  },
  {
    name: 'Game Control',
    to: '/admin/gamestate',
    iconClass: 'orange gamepad',
  },
  {
    name: 'Sponsors',
    to: '/admin/sponsors',
    iconClass: 'red heart',
  },
  {
    name: 'Puzzles',
    to: '/admin/puzzles',
    iconClass: 'violet puzzle',
  },
  {
    name: 'Treasure Hunt',
    to: '/admin/checkpoints',
    iconClass: 'blue compass',
  },
];

const volunteerMenuItems = [
  {
    name: 'Home',
    to: '/volunteer',
    iconClass: 'violet home',
  },
  {
    name: 'Game Progress',
    to: '/game-progress',
    iconClass: 'teal refresh',
  },
];

export default TopBar = class TopBar extends Component {
  updateDimensions() {
    this.forceUpdate();
  }
  isSmall() {
    return window.innerWidth < 1100; 
  }
  render() {
    return (
      <div>
        {this._renderTopBar()}
        {this._renderBanner()}
      </div>
    );
  }

  _renderBanner() {
    const { gamestate } = this.props;
    if (!gamestate || !gamestate.showWebinarLink) return "";

    const { webinarURL } = gamestate

    return (
      <Container>
        <Segment textAlign="center" color="blue" inverted>
          <a href={webinarURL} target="_blank" style={{color: "white"}}>
            <Icon name="video camera" />
            Click here to join the Zoom Webinar
          </a>
        </Segment>
      </Container>
    )
  }

  _renderTopBar() {
    const { isAdmin, isVolunteer } = this.props;

    let logoDesktop = {
      width: '50px',
      height: '50px',
      borderRadius: '25px',
      transform: "translate(25px, 25px) scale(2.5)",
      marginLeft: "10px",
      marginRight: "50px",
      marginTop: "10px",
      overflow: "hidden",
    };
    let logoMobile = {
      height: '50px',
      marginLeft: "7px",
      marginTop: "7px",
    }
    let logoShadow = {
      width: '125px',
      height: '125px',
      borderRadius: '62.5px',
      marginTop: "-66.41px",
      boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
      backgroundColor: "white",
      mixBlendMode: "darken"
    };
    let logoLink = (
      <a href="/" style={{zIndex: "99"}}>
        <div style={ this.isSmall() ? logoMobile : logoDesktop }>
          <img height="50px" src="/img/topbar-logo.png"></img>
        </div>
      </a>
    );
    let logoLinkShadow = (
      
      <div style={{position: "absolute", height: "100px", width:"100%", overflow: "hidden", marginTop:"66.41px", marginLeft:"-3px", pointerEvents: "none"}}>
      <div style={logoShadow}></div>
      </div>
      
    )

    return (
      <div className="ui fixed small labeled icon menu top-bar" ref="topbar">
        
        {/* this._renderSocialButtons() */}
        { logoLink }
        { this.isSmall() ? null : logoLinkShadow }
        
        <div style={{display: this.isSmall() ? "flex" : "none"}} className="ui dropdown item" ref="menuDropdown">
          <i className="large content icon"></i>
          Menu
          <div className="menu topbar-dropdown-menu">
            { this._renderMenuLinks(mainMenuLinks) }  
          </div>
        </div>

        <div style={{display: this.isSmall() ? "none" : "flex"}} className="menu">
          { this._renderMenuLinks(mainMenuLinks) }  
        </div>

        <div className="right menu">
          { isAdmin() ? this._renderAdminMenu() : null }
          { isVolunteer() ? this._renderVolunteerMenu() : null }

          {this._checkinButton()}
          {this._gameButton()}
	  {this._treasureHuntButton()}

          {this._profileMenu()}
        </div>
      </div>
    );
  }

  _renderMenuLinks(links) {
    const { gamestate } = this.props;
    const linksToRender = links.slice();
    if (gamestate && gamestate.leaderboard)
      linksToRender.push(leaderboardLink);
    if (gamestate && gamestate.buyGear)
      linksToRender.push(gearLink);
    return linksToRender.map((item) => this._renderMenuLink(item));
  }

  _renderMenuLink(item) {
    /* Quick fix for the fact that the leaderboard can be in two menus at
       once and we don't want to reuse its path as a key. React complains. */
    const key = item.key || item.to;
    if (item.custom) {
      return (
        <a key={key} className='item' href={item.to}>
          <Icon className={item.iconClass}/>
          {item.name}
        </a>
      );
    } else {
      return (
        <Link key={key} className='item' to={ item.to }>
          <Icon className={ item.iconClass }/>
          { item.name }
        </Link>
      );
    }
  }

  _renderSocialButtons() {
    const socialApps = Object.keys(Meteor.settings.public.social);
    return socialApps.map((app) => this._socialButton(app));
  }

  _socialButton(socialApp) {
    return (
      <a className="item" href={Meteor.settings.public.social[socialApp]} target="_blank" key={`${socialApp}-btn`}>
        <i className={`large ${socialApp} ${socialApp}-color icon`}></i>
        {`${socialApp[0].toUpperCase()}${socialApp.substring(1)}`}
      </a>
    );
  }

  _renderAdminMenu() {
    return (
      <div className="ui dropdown item">
        <Icon name='spy' size='large'/>
        Admin
        <div className="menu topbar-dropdown-menu">
          { this._renderMenuLinks(adminMenuItems) }
        </div>
      </div>
    );
  }

  _renderVolunteerMenu() {
    return (
      <div className="ui dropdown item">
        <Icon name='clock' size='large'/>
        Volunteer
        <div className="menu topbar-dropdown-menu">
          { this._renderMenuLinks(volunteerMenuItems) }
        </div>
      </div>
    );
  }

  _profileMenu() {
    const { user } = this.props;
    if (user) {
      const isPlayer = user.hasRole('player');
      return (
        <div className="ui dropdown item">
          <Icon name='settings' size='large'/>
          { this.props.user.firstname }

          <div className="menu topbar-dropdown-menu">

            <Link className="item" to="/profile">
              <Icon name="user" color="green"/>
              Profile
            </Link>

            {isPlayer ? this._teamButton() : null }

            <Link className="item" to="/rules">
              <Icon name="info" color="teal"/>
              Rules of Play
            </Link>

            <div className="divider"></div>

            <a className="item" onClick={(e) => this._logout(e)}>
              <Icon name="sign out"/>
              Logout
            </a>

          </div>
        </div>
      );
    }

    return (
      <Link className="item" to="/login">
        <Icon name='sign in'/>
        Login
      </Link>
    );
  }

  _teamButton() {
    return (
      <Link className="item" to="/team">
        <Icon name="users" color="blue" />
        Team
      </Link>
    );
  }

  _checkinButton() {
    const { hasTeam } = this.props;
    if (!hasTeam()) return null;
    return (
      <Link className="item" to="/team/checkin">
        <Icon name="rocket"/>
        Check In
      </Link>
    );
  }

  _gameButton() {
    const { gamestate, hasTeam } = this.props;
    if (!hasTeam()) return null;
    if (gamestate && gamestate.gameplay) {
      return (
	<Link className="item" to="/game">
	  <PuzzleHuntIcon value={true} />
          Puzzle hunt
	</Link>
      );
    } else {
      return null;
    }
  }

  _treasureHuntButton() {
    const { gamestate, hasTeam } = this.props;
    if (!hasTeam()) return null;
    if (gamestate && gamestate.treasureplay) { 
      return (
	<Link className="item" to="/treasure">
	  <TreasureHuntIcon value={true} />
          Treasure hunt
	</Link>
      );
    } else {
      return null;
    }
  }

  _logout(event) {
    event.preventDefault();
    return Meteor.logout(() => browserHistory.push('/'));
  }

  _initDropDownMenus() {
    $(this.refs.topbar).find('.ui.dropdown').dropdown();
  }

  componentDidMount() {
    this._initDropDownMenus();
    window.addEventListener("resize", this.updateDimensions.bind(this));
  }

  componentDidUpdate(prevProps, prevState) {
    this._initDropDownMenus();
  }

}

TopBar = GamestateComp(TopBar);
TopBar = withTracker(() => {
  const user = Meteor.user({ fields: {
    roles: 1,
    firstname: 1,
    teamId: 1,
  }});
  if (user && !user.roles) {
    console.error("this component tried to call user.hasRole ",
                  "but user.roles is undefined. ",
                  "component: TopBar.jsx");
  }
  return {
    user,
    isAdmin() {
      return Boolean(user) && user.hasRole('admin');
    },
    isVolunteer() {
      return Boolean(user) && user.hasRole('volunteer');
    },
    hasTeam() {
      return Boolean(user) && user.teamId;
    },
  };
})(TopBar);
