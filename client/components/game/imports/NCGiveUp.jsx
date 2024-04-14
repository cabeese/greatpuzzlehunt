import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import { Button, Confirm, Segment } from 'semantic-ui-react';
import moment from 'moment';

export default class GiveUp extends React.Component {
    server_poll_count = 0;
    constructor(props) {
        super(props);
        this.state = {
            showConfirm: false,
            loading: false,
            now: null,
        };
        this._handleClick = this._handleClick.bind(this);
        this._enabled = this._enabled.bind(this);

        // Polling logic based on client/components/imports/PuzzleProgress.jsx
        const hasEnded = Boolean(props.puzzle.end);
        if (!hasEnded) {
            const _this = this;
            // Update our clock from the server once per minute to reduce skew.
            this.interval = Meteor.setInterval(() => {
                if (this.server_poll_count % 60 === 0) {
                  Meteor.call('serverTime', (err, time) => {
                    if (err) {
                      console.warn("GiveUp component failed to fetch server time");
                      console.warn(err);
                      _this.setState({ now: moment() });
                    }
                    else _this.setState({ now: moment(time) });
                  });
                } else {
                    _this.setState({ now: moment(_this.state.now).add(1, 'second') });
                }
                this.server_poll_count++;
            }, 1000);
        }
    }

    componentWillUnmount() {
        Meteor.clearInterval(this.interval);
    }

    _doGiveUp(){
        let teamId = this.props.team._id;
        let puzzleId = this.props.puzzle.puzzleId;
        this.setState({loading: true});

        Meteor.call("team.puzzle.giveUp", puzzleId, teamId, (error, result)=>{
            if (error) {
                console.log(error);
                alert(`Unable to give up: ${error.reason}. Please talk to a volunteer`);
            }
            this.setState({loading: false});
        });
    }

    _handleClick(e){
        if(e.preventDefault) e.preventDefault();
        this.setState({showConfirm: true});
    }

    _handleSubmit(e) {
        e.preventDefault();
        const { puzzle } = this.props;
        const { answer } = this.state;
    
        Meteor.call('team.puzzle.answer', puzzle.puzzleId, answer, (error, result) => {
          this.setState({ answer: '' });
          if (error) this.setState({ error });
          else if (result.message) {
            this.setState({ message: result.message });
            Meteor.setTimeout(() => this.setState({ message: null }), 2000);
          }
        });
      }

      _confirmationModal(){
        let { showConfirm } = this.state;
        return (
          <Confirm
            open={showConfirm}
            header="Are you sure?"
            content={<Segment basic style={{fontSize: '16px'}}>
                       <p>Are you sure you want to end this puzzle and get the answer?</p>
                       <p>You will receive the full timeout score for this puzzle!</p>
            </Segment>}
            confirmButton={`Yes, get the answer!`}
            cancelButton="Nevermind! We'll keep trying."
            onConfirm={() => {
                this.setState({showConfirm: false});
                this._doGiveUp();
            }}

            onCancel={() => this.setState({showConfirm: false})}
            size="large"
          />
        );
      }

    _enabled() {
      const { loading, puzzle } = this.props;
      const { now } = this.state;
      if (!now || !puzzle || loading || puzzle.end) return false;

      // Enable only if at least halfway through the puzzle
      const waitUntil = moment(moment(puzzle.start) +
                               moment.duration({minutes: puzzle.allowedTime / 2}));
      return now.isAfter(waitUntil);
    }

    render(){
        const { puzzle } = this.props;
        const disabled = !this._enabled();
        return (
            <div>
                { this._confirmationModal() }
                <Button fluid color='red' content='Give Up'
                        disabled={disabled} onClick={this._handleClick} />
            </div>
        );
    }
}

GiveUp.propTypes = {
    team: PropTypes.object.isRequired,
    puzzle: PropTypes.object.isRequired,
};

