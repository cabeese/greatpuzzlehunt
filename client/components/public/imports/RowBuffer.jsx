// import React, { Component, PropTypes } from 'react';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Grid } from 'semantic-ui-react';

export default class RowBuffer extends Component {
  render() {
    return (
      <Grid.Row>
        <Grid.Column className='dark-blue'><br/></Grid.Column>
      </Grid.Row>
    )
  }
}
