import React, {PropTypes} from 'react';
import { Grid, Button, Header, List } from 'semantic-ui-react';
import GamestateComp from './GamestateComp';

class ICEContact extends React.Component {
  render() {
    const gamestate = this.props.gamestate || {};
    const { gameplay } = gamestate;
    const phone = gameplay ? Meteor.settings.public.contact.phone :
      "(Hidden)"
    let { webinarURL, webinarID } = gamestate;
    if (!webinarID) webinarID = "Coming soon...";

    let joinByLink = "Meeting details will be posted soon";
    if (webinarURL) {
      joinByLink = (
            <Header as='h3'>
              <strong>Click to join the webinar:</strong> <a href={webinarURL} target="_blank">{webinarURL}</a>
            </Header>
      );
    }

    return (
      
      <Grid>

        <Grid.Row columns='1'>
          <Grid.Column>
            <Header as='h2' content='In Game Contact'
                    subheader='For emergency or reporting unsportsmanlike behavior. Phone available only when Hunt in session; standard fees may apply'/>
          </Grid.Column>
        </Grid.Row>

        <Grid.Row columns='3'>
          <Grid.Column>
            <Button disabled={!gameplay} fluid as='a' color='blue' content={'Call: ' + phone} href={"tel:" + phone} />
          </Grid.Column>
          <Grid.Column>
            <Button disabled={!gameplay} fluid as='a' color='orange' content={'Text: ' + phone} href={"sms:" + phone} />
          </Grid.Column>
          <Grid.Column>
            <Button fluid as='a' color='green' content='Email' href="mailto:support@greatpuzzlehunt.com"/>
          </Grid.Column>
        </Grid.Row>

        <Grid.Row columns='1'>
          <Grid.Column>
            <Header as='h2' content='Zoom Webinar' />
            Join us before and after the Hunt for announcements and information.
            Stream starts at <strong>10:15 am (PT)</strong> on the day of the Hunt.

            {joinByLink}
            <List>
              <List.Item>
                <strong>Or One tap mobile:</strong>
                <List>
                  <List.Item>
                    <em>US:</em> +13017158592,,93972548433#  or +13126266799,,93972548433#
                  </List.Item>
                </List>
              </List.Item>
              <List.Content>
                <strong>Or Telephone:</strong><br />
                Dial (for higher quality, dial a number based on your current location):
                <List.List>
                  <List.Item>
                    <em>US:</em> +1 301 715 8592  or +1 312 626 6799  or +1 646 558 8656  or +1 253 215 8782  or +1 346 248 7799  or +1 669 900 6833 
                  </List.Item>
                </List.List>
                <a href="https://wwu-edu.zoom.us/u/abnvpc64Kw" target="_blank">
                  Click here for a list of all international numbers available
                </a><br />
                <strong>Webinar ID:</strong> {webinarID}<br />
              </List.Content>
            </List>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

ICEContact = GamestateComp(ICEContact);
export default ICEContact;
