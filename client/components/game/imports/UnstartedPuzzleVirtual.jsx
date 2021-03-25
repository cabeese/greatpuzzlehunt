import React, {PropTypes} from 'react';
import { Segment, Header, Button, Confirm, Modal } from 'semantic-ui-react';

export default class UnstartedPuzzleVirtual extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmOpen: false,
      modalOpen: false,
      modelContent: "",
    };
  }

  showConfirm = () => this.setState({ confirmOpen: true })
  handleCancelConfirm = () => this.setState({ confirmOpen: false })
  handleConfirm = () => {
    const teamId = this.props.team._id;
    const puzzleId = this.props.puzzle.puzzleId;
    Meteor.call('team.startPuzzleVirtuallyByPlayer', teamId, puzzleId, error => {
      this.setState({ confirmOpen: false });

      if (error) {
        this.setState({
          modalContent: error.reason,
          modalOpen: true,
        });
      }
    });
  }

  _downloadButton = () => {
    const disabled = this.props.disabled;
    const text = "Download puzzle (PDF) and start timer";

    return (
      <Button
        disabled={disabled}
        content={text}
        size="huge"
        color="blue"
        icon="clock"
        onClick={this.showConfirm}
        />
    );
  }

  render() {
    const { confirmOpen, modalOpen, modalContent } = this.state;
    const { puzzle, disabled } = this.props;
    const puzzleName = puzzle.name;

    return (
      <Segment disabled={ disabled }>
        <Header as='h3' content={this.props.puzzle.name} subheader={this.props.puzzle.location}/>

        <Modal open={modalOpen}
          header="Failed to start puzzle!"
          content={modalContent}
          onClose={() => this.setState({modalOpen: false})}
          actions={[{ key: 'okay', content: 'Okay!', positive: true }]}
          />

        { this._downloadButton() }

        <Confirm open={confirmOpen}
          onCancel={this.handleCancelConfirm}
          onConfirm={this.handleConfirm}
          header={`Are you sure you're ready to start the puzzle "${puzzleName}"?`}
          content="You will be presented with a download link (PDF) and the timer will start immediately. Make sure your whole team is ready to go!"
          confirmButton="YES, we're ready!"
          cancelButton="Not yet"
        />

      </Segment>
    );
  }
}

UnstartedPuzzleVirtual.propTypes = {
  team: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  puzzle: PropTypes.object.isRequired,
  disabled: PropTypes.bool.isRequired,
};
