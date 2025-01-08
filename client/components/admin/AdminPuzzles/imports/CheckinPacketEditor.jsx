import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Container, Button, Icon } from 'semantic-ui-react';

import GamestateComp from '../../../imports/GamestateComp';

class Editor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            url: "",
        };
    }
    componentWillReceiveProps(props) {
        if (props.gamestate) {
            this.setState({
                url: props.gamestate.checkinPacketURL || "",
            });
        }
    }

    _handleChange(e) {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    async _handleSubmit(e) {
        e.preventDefault();
        this.setState({loading: true});
        const { url } = this.state;

        try {
                await Meteor.callAsync(`admin.gamestate.setCheckinPacket`, url);
                alert("OK! Saved new check-in packet URL");
        } catch (error){
                console.log(error);
                alert("Failed to save checkin packet. " + error.reason);
        }
        this.setState({loading: false});
    }

    render(){
        if (!this.props.ready) {
            return <span>Loading...</span>
        }

        const { loading, url } = this.state;
        const storedURL = this.props.gamestate.checkinPacketURL;
        const disabled = loading || url === storedURL;
        return (
            <Container>
                <Form onSubmit={async (e) => await this._handleSubmit(e) }>
                    <Form.Group inline>
                        <Form.Input name='url' label='Check-in Packet URL'
                            value={ url } width={15}
                            onChange={ (e) => this._handleChange(e) }
                            />
                        <Form.Button content="Save" color="green" disabled={disabled} />
                    </Form.Group>
                </Form>
                <Button as="a" href={storedURL} fluid size="small"
                    download="GPH 2021 Check-In Packet.pdf" target="_blank">
                    <Icon name="download" />
                    Download check-in packet (to test URL)
                </Button>
            </Container>
        );
    }
}

Editor.propTypes = {
    ready: PropTypes.bool.isRequired,
    gamestate: PropTypes.object,
};

export const CheckinPacketEditor = GamestateComp(Editor);
