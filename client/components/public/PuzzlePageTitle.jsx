import React, { Component, PropTypes } from 'react';
import { Grid, Segment } from 'semantic-ui-react';

PuzzlePageTitle = class PuzzlePageTitle extends Component {
  render() {
    const smallStyle = {
      fontSize: '.65em',
    };
    return (
       <h1 className='dark-blue'>
         {this.props.title}
         {/* <small style={ smallStyle }>{this.props.subTitle}</small> */}
        </h1>
    );
  }
}

PuzzlePageTitle.propTypes = {
  title: PropTypes.node.isRequired,
  subTitle: PropTypes.string,
};
