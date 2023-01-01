import React, {Component} from 'react';
import {Icon} from 'semantic-ui-react';

export default class MaybeNullIcon extends Component {
    _null() {
        return (
            <Icon name="question" color="red" bordered size="small" />
        );
    }

    render() {
        const {value, truthy, falsey} = this.props;

        if (value === true && truthy) {
            return truthy;
        } else if (value === false && falsey) {
            return falsey;
        } else {
            return this._null();
        }
    }
}