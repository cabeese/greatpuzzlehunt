import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Header, Button, Icon, Segment } from 'semantic-ui-react';

import GamestateComp from '../../imports/GamestateComp';

class CheckinPacketUI extends Component {
    render() {
        if (!this.props.ready){
            return <span>Check-in Packet loading...</span>;
        }

        const { checkinPacketURL } = this.props.gamestate;
        if (!checkinPacketURL){
            return <span>No downloadable check-in packet found</span>;
        }

        return (
            <Grid.Row columns='1'>
                <Grid.Column>
                    <Segment inverted color="teal" >
                        <Header as='h2' content='Check-in Packet (Download First!)' />
                        <Button as="a" href={checkinPacketURL} fluid color="olive"
                            download="GPH 2021 Check-In Packet.pdf" target="_blank">
                            <Icon name="download" />
                            Download The Check-In Packet (PDF)
                        </Button>
                    </Segment>
                </Grid.Column>
            </Grid.Row>
        );
    }
}

CheckinPacketUI.propTypes = {
    ready: PropTypes.bool.isRequired,
    gamestate: PropTypes.object,
};

export default CheckInPacket = GamestateComp(CheckinPacketUI);
