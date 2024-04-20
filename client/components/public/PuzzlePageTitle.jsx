import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Segment } from 'semantic-ui-react';

PuzzlePageTitle = class PuzzlePageTitle extends Component {
  render() {
    const smallStyle = {
      fontSize: '.65em',
    };
    const SubTitle = this.props.subTitle ?
          <small style={ smallStyle }><br />{this.props.subTitle}</small>
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
  subTitle: PropTypes.string,
};
