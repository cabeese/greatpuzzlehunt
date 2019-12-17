import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { Link, browserHistory } from 'react-router';
import { withTracker } from 'meteor/react-meteor-data';
import { Icon } from 'semantic-ui-react';
import Scrollchor from 'react-scrollchor';

import GamestateComp from '../imports/GamestateComp';

const leaderboardLink = {
  name: 'Leaderboard',
  to: '/leaderboard',
  iconClass: 'yellow trophy',
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

TopBar = class TopBar extends Component {
  updateDimensions() {
    this.forceUpdate();
  }
  isSmall() {
    return window.innerWidth < 1100; 
  }
  render() {
    const { isAdmin, isVolunteer } = this.props;

    let logoStyle = {
      backgroundColor: 'white',
      width: '50px',
      height: '50px',
      borderRadius: '25px',
      transform: "translate(25px, 25px) scale(2)",
      marginRight: "55px"
    };
    let logoLink = (
      <a href="/" style={logoStyle}>
        <img height="50px" src="/img/logo_svg.svg"></img>
      </a>
    );

    let hamburgerMenu = (
      <div className="ui dropdown item" ref="menuDropdown">
        <i className="large content icon"></i>
        Menu
        <div className="menu topbar-dropdown-menu">
          { this._renderMenuLinks(mainMenuLinks) }  
        </div>
      </div>
    );
    let navMenu = (
      <div className="menu">
        
        { this._renderMenuLinks(mainMenuLinks) }  
      </div>
    );

    return (
      <div className="ui fixed inverted small labeled icon menu top-bar" ref="topbar">
        
        {/* this._renderSocialButtons() */}
        { logoLink }
        { this.isSmall() ? hamburgerMenu : navMenu }

        <div className="right menu">
          { isAdmin() ? this._renderAdminMenu() : null }
          { isVolunteer() ? this._renderVolunteerMenu() : null }

          {this._checkinButton()}
          {this._gameButton()}

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
    const { hasTeam } = this.props;
    if (!hasTeam()) return null;
    return (
      <Link className="item" to="/game">
        <Icon name="puzzle"/>
        Game
      </Link>
    );
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
  return {
    user: Meteor.user(),
    isAdmin() {
      return Boolean(Meteor.user()) && Meteor.user().hasRole('admin');
    },
    isVolunteer() {
      return Boolean(Meteor.user()) && Meteor.user().hasRole('volunteer');
    },
    hasTeam() {
      const user = Meteor.user();
      return Boolean(user) && user.teamId;
    },
  };
})(TopBar);
