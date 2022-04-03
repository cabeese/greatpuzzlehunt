import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, Message, Icon, Statistic } from 'semantic-ui-react';
import { reduce } from 'lodash';

import AdminTransactionTableRow from './AdminTransactionTableRow';

class AdminTransactionTable extends Component {
  getStats(transactions) {
    let ret = {
      total: 0,
      inPerson: 0,
      virtual: 0,
    };
    transactions.forEach(tx => {
      if (tx.tickets) {
        ret.total += tx.tickets.length;
        tx.tickets.forEach(ticket => {
          const ct = ticket.qty;
          if (ticket.inPerson) ret.inPerson += ct;
          else ret.virtual += ct;
        });
      }
    });
    return ret;
  }

  render() {
    const { loading, transactions } = this.props;
    if (loading) return <Loading />;
    const { total, inPerson, virtual } = this.getStats(transactions);

    return (
      <div> {/* outer div for react root component element */}
        <Message icon>
          <Icon name="ticket" color="blue"/>
          <Message.Content>
            <Statistic.Group size="tiny">
              <Statistic>
                <Statistic.Label>Total</Statistic.Label>
                <Statistic.Value>{total}</Statistic.Value>
              </Statistic>
              <Statistic>
                <Statistic.Label>Virtual</Statistic.Label>
                <Statistic.Value>{virtual}</Statistic.Value>
              </Statistic>
              <Statistic>
                <Statistic.Label>In-Person</Statistic.Label>
                <Statistic.Value>{inPerson}</Statistic.Value>
              </Statistic>
            </Statistic.Group>
          </Message.Content>
        </Message>
        <Table celled striped>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Created</Table.HeaderCell>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Email</Table.HeaderCell>
              <Table.HeaderCell>Tx #</Table.HeaderCell>
              <Table.HeaderCell>Actions</Table.HeaderCell>
              <Table.HeaderCell>Tickets</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {this._renderTransactions()}
          </Table.Body>
        </Table>
      </div>
    );
  }

  _renderTransactions() {
    const { transactions, tickets, gearOrders } = this.props;
    return transactions.map((transaction) => {
      const { tx } = transaction;
      return <AdminTransactionTableRow transaction={transaction} key={tx} tickets={tickets[tx]} gearOrders={gearOrders[tx]}/>;
    });
  }
}

AdminTransactionTable.propTypes = {
  loading: PropTypes.bool.isRequired,
  transactions: PropTypes.arrayOf(PropTypes.object),
  tickets: PropTypes.object,
  gearOrders: PropTypes.object,
};

export default AdminTransactionTable;
