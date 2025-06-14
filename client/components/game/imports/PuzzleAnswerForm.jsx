import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import { Image, Form, Message } from 'semantic-ui-react';
import GiveUp from './NCGiveUp';

export default class PuzzleAnswerForm extends React.Component {
  messageTimer = null;
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      answer: '',
      triggerHintImageURL: '',
      message: null,
      error: null,
    };
  }

  componentWillUnmount() {
    if (this.messageTimer) {
      Meteor.clearTimeout(this.messageTimer);
      this.messageTimer = null;
    }
  }

  render() {
    return (
      <Form onSubmit={ async (e) => await this._handleSubmit(e) }
            style={ { paddingTop: '10px' }}>
        <Form.Input
          size='large'
          name='answer'
          label='Puzzle Answer (Case Insensitive)'
          placeholder='Answer'
          value={ this.state.answer }
          onChange={ (e) => this._handleChange(e) }
        />
        <Form.Button basic fluid color='green' content='Submit Answer'
                     disabled={this.state.loading} />
        { this._message() }
        { this._error() }
        { this._giveUpButton() }
      </Form>
    );
  }

  _giveUpButton() {
    const { team, puzzle } = this.props;
    // Don't give this option for "short" puzzles (e.g. Meta Puzzle)
    if (puzzle.allowedTime < 30) return null;

    return <GiveUp team={team} puzzle={puzzle} />;
  }

  async _handleSubmit(e) {
    e.preventDefault();
    // const smartQuoteRegex = /\u{201c}|\u{201d}/ug
    // const smartApostropheRegex = /\u{2018}|\u{2019}/ug
    const nonCharacterDigit = /[^a-zA-Z0-9]/ug
    const { puzzle } = this.props;
    // const answer = this.state.answer.replace(smartQuoteRegex, '"').replace(smartApostropheRegex, '\'');
    const answer = this.state.answer.replaceAll(nonCharacterDigit, '');

    try {
      this.setState({ loading: true });
      const result = await Meteor.callAsync('team.puzzle.answer', puzzle.puzzleId, answer);
      this.setState({ answer: '', error: '' });

      if (this.messageTimer) Meteor.clearTimeout(this.messageTimer);

      const { message, triggerHintImageURL } = result;
      let timeout = 2000;
      if (message || triggerHintImageURL) {
        if (message) {
          this.setState({ message, triggerHintImageURL: '' });
        } else {
          timeout = 10000;
          this.setState({ triggerHintImageURL, message: '' });
        }
        this.messageTimer = Meteor.setTimeout(() => this.setState({
          message: null, triggerHintImageURL: '',
        }), timeout);
      }
    } catch (error) {
      this.setState({ error });
    }
    this.setState({ loading: false });
  }

  _handleChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  _message() {
    const { message, triggerHintImageURL } = this.state;
    if (message) {
      return <Message
        content={ message }
        onDismiss={ () => this.setState({ message: null }) }
      />
    } else if (triggerHintImageURL) {
      return (
        <Message>
          Almost!<br />
          <Image as="a" href={triggerHintImageURL} src={triggerHintImageURL}/>
        </Message>
      );
    } else {
      return null;
    }
  }

  _error() {
    const { error } = this.state;
    if (!error) return null;
    return <Message
      negative
      content={ error.reason }
      onDismiss={ () => this.setState({ error: null }) }
    />
  }
}

PuzzleAnswerForm.propTypes = {
  team: PropTypes.object.isRequired,
  puzzle: PropTypes.object.isRequired,
};
