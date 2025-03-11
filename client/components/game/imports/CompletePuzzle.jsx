import React from 'react';
import PropTypes from 'prop-types';
import { Button, Segment, Header, Message, Statistic } from 'semantic-ui-react';
import moment from 'moment';

import PuzzleProgress, { renderScore } from '../../imports/PuzzleProgress';
import { getHintsTaken } from '../../../../lib/imports/puzzle-helpers';

export default class CompletePuzzle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showAnswer: false,
    };
  }

  render() {
    const { team, puzzle, disabled } = this.props;
    const isNC = team.division === "noncompetitive";

    return (
      <Segment disabled={ disabled }>
        <Header as='h3' content={ this.props.puzzle.name }/>
        {isNC ? "" : <PuzzleProgress puzzle={ puzzle }/>}
        <Message positive={ !puzzle.timedOut } warning={ puzzle.timedOut }>
          <Message.Header>{ this._header() }</Message.Header>
          { this._answer() }
        </Message>
      </Segment>
    );
  }

  _header() {
    if (this.props.puzzle.timedOut) {
      return 'Timed Out';
    } else {
      return 'Solved!';
    }
  }

  _answer() {
    if (this.props.puzzle.timedOut && !this.state.showAnswer) {
      return this._answerHidden();
    } else {
      return this._answerDisplayed();
    }
  }

  _answerHidden() {
    const self = this;
    return (
      <Button content="Answer hidden - click to reveal"
              color="green"
              onClick={() => self.setState({showAnswer: true}) } />
    );
  }

  _answerDisplayed() {
    const { puzzle } = this.props;
    const { time, minutes } = renderScore(puzzle.score);
    const hintsTaken = getHintsTaken(puzzle.hints);
    return (
      <pre>
        Answer: { puzzle.answer }<br/>
        Hints : { hintsTaken }<br/>
        Score : { time }<br/>
        ({ minutes } minutes)
      </pre>
    );
  }
}

CompletePuzzle.propTypes = {
  team: PropTypes.object.isRequired,
  puzzle: PropTypes.object.isRequired,
  disabled: PropTypes.bool.isRequired,
};
