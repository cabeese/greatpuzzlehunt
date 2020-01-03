import React, {PropTypes} from 'react';
import { Grid, Button, Header } from 'semantic-ui-react';
import GamestateComp from './GamestateComp';

class ICEContact extends React.Component {
  render() {
    const gamestate = this.props.gamestate || {};
    const { gameplay } = gamestate;
    const phone = gameplay ? Meteor.settings.public.contact.phone :
      "(Hidden)"

    return (
      
      <Grid>
        <Grid.Row columns='1'>
          <Grid.Column>
            <Header as='h2' content='In Game Contact'
                    subheader='For emergency or reporting unsportsmanlike behavior. Phone available only when Hunt in session'/>
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
      </Grid>
    );
  }
}

ICEContact = GamestateComp(ICEContact);
export default ICEContact;
