import { Meteor } from 'meteor/meteor';
import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';

Authed = class Authed extends React.Component {
  render() {
    const { user } = this.props;
    if (this.props.canView()) {
      if (user.paid) {
        return this.props.children;
      } else {
        return <RedeemTicket user={user}/>
      }
    } else {
      return <Login />;
    }
  }
}

Authed = withTracker(({ accessLevel }) => {
  // TODO: fetching the entire user object is expensive. We should
  // trim down to the minimum necessary fields, though this may be
  // complex due to how many components use this component.
  const user = Meteor.user();
  return {
    user: user,
    canView() {
      if (user && !user.roles) {
        console.error("this component tried to call user.hasRole ",
                      "but user.roles is undefined. ",
                      "component: Authed.jsx");
      }
      return Boolean(user) && user.hasRole(accessLevel);
    }
  };
})(Authed);
