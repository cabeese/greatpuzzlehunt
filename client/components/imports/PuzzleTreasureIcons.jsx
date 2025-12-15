import React, {Component} from 'react';
import {Image} from 'semantic-ui-react';

export class PuzzleHuntIcon extends Component {

  render() {
    const puzzleHuntURL = '/img/GPH-icons-puzzle.svg';
    const {value, disabled, spaced} = this.props;

    const sp = spaced ? spaced : 'false';
    
    if (value === true) {
      if (disabled) {
	return <Image src={puzzleHuntURL} spaced={sp} disabled inline style={{width: '18px', height: 'auto'}}/>
      } else {
	return <Image src={puzzleHuntURL} spaced={sp} inline style={{width: '18px', height: 'auto'}}/>
      }
    } else {
      return '';
    }
  }
}

export class TreasureHuntIcon extends Component {

  render() {
    const treasureHuntURL = '/img/GPH-icons-chest.svg';
    const {value, disabled, spaced} = this.props;

    const sp = spaced ? spaced : 'false';
    
    if (value === true) {
      if (disabled) {
	return <Image src={treasureHuntURL} spaced={sp} inline disabled style={{width: '18px', height: 'auto'}}/>
      } else {
	return <Image src={treasureHuntURL} spaced={sp} inline style={{width: '18px', height: 'auto'}}/>
      }
    } else {
      return '';
    }
  }
}
