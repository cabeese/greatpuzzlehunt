import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import GamestateComp from '../../imports/GamestateComp'

import { Container, Grid, List, Message } from 'semantic-ui-react';
import * as DOMPurify from 'dompurify';

class HomeBanner extends Component {
  render() {
    const gamestate = this.props.gamestate || {};
    const { displayBanner, bannerHtmlUnsanitized } = gamestate;
    if (!displayBanner) {
      return "";
    }
    const content = DOMPurify.sanitize(bannerHtmlUnsanitized);

    return (
      <section id="announcements-message">
        <Grid padded stackable centered textAlign='left'>
          <Grid.Row>
            <Grid.Column width={16} className='raised'>
              <Container textAlign='left'>
                <Message warning>
                  <div dangerouslySetInnerHTML={{__html: content}}></div>
                </Message>
              </Container>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </section>
    );
  }
}


HomeBanner = GamestateComp(HomeBanner);
export default HomeBanner
