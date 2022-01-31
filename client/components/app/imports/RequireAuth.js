import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';

export default class RequireAuth extends Component {
  render() {
    return <Authed accessLevel={this.props.accessLevel}>{this.props.children}</Authed>;
  }
}