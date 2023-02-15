import React, { Component } from 'react';
import { Icon, Grid, Header, Segment, Divider, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

NoTeamMessage = class NoTeamMessage extends Component {
  render() {
    return (
      <Segment placeholder>
        <Grid stackable columns={2}>
          <Grid.Row>
            <Grid.Column textAlign="center">
              <Header icon>
                <Icon name='group' color='teal' />
                I know who I'll be playing with
              </Header>
            </Grid.Column>

            <Grid.Column>
              Create a new team and invite your friends
              <Link to='/team/create'>
                <Button fluid color='teal'
                        content='Create a Team'
                        icon='right arrow' labelPosition='right'/>
              </Link>

              Browse existing teams
              <Link to='/team/join'>
                <Button fluid color='teal'
                        content='Join a Specific Team'
                        icon='right arrow' labelPosition='right'/>
              </Link>
            </Grid.Column>
          </Grid.Row>
        </Grid>

        <Divider horizontal color='orange'>
          <Header as='h2'>
            OR
          </Header>
        </Divider>

        <Grid stackable columns={2}>
          <Grid.Row>
            <Grid.Column textAlign="center">
              <Header icon>
                <Icon name='question' color='blue'/>
                I'm looking for others to play with
              </Header>
            </Grid.Column>

            <Grid.Column>
              Browse players looking for a team
              <Link to='/looking-for-team'>
                <Button fluid color='blue'
                        content='Players looking for teams'
                        icon='right arrow' labelPosition='right' />
              </Link>

              Browse teams looking for more members
              <Link to={{pathname: '/team/join',
                         search: '?filter=recruiting'}}>
                <Button fluid color='blue'
                        content='Teams looking for players'
                        icon='right arrow' labelPosition='right'/>
              </Link>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    );
  }
}
