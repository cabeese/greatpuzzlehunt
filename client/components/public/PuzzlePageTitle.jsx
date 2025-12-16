import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Segment } from 'semantic-ui-react';

PuzzlePageTitle = class PuzzlePageTitle extends Component {
  render() {
    const smallStyle = {
      fontSize: '.65em',
    };
    console.log('puzzle page title, subtitle:');
    console.log(this.props.subtitle);
    const SubTitle = this.props.subtitle ?
          <small style={ smallStyle }><br />{this.props.subtitle}</small>
          :
          "";
    return (
       <h1 className='dark-blue'>
         {this.props.title}
         {SubTitle}
        </h1>
    );
  }
}

PuzzlePageTitle.propTypes = {
  title: PropTypes.node.isRequired,
  subtitle: PropTypes.string,
};
