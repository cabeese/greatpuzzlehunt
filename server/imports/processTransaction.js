import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import {
  map,
  extend,
  omit
} from 'lodash';

import { sendTickets } from '../../lib/imports/sendTickets';

export default async function processTransaction(txData) {
  const { info, logobj } = Meteor.logger;
  const now = new Date();

  const {
    tx,
    email,
    name,
    gear,
    studentTickets: studentTicketsString,
    nonStudentTickets: nonStudentTicketsString,
    shippingInfo,
    internationalShippingLineItems,
  } = txData;

  const studentTickets = parseInt(studentTicketsString);
  const nonStudentTickets = parseInt(nonStudentTicketsString);
  const gearOrders = gear;

  info(`Processing transaction "${tx}" from ${email}`);
  info(`studentTickets: ${studentTickets} nonStudentTickets: ${nonStudentTickets}` +
    ` internationalShipping?: ${shippingInfo.internationalCount}`);
  info("Gear Orders:")
  logobj(gearOrders);

  /*
  Important Note:
  For Indempotency we check if transactions/tickets/gear orders have already
  been created with this transaction code. If they have, we skip inserting new
  documents. Every transaction will have a unique tx code.
  */

  // 1. Create Transaction
  const existingTransactions = Transactions.find({ tx }).count();
  if (existingTransactions === 0) {
    Transactions.insert({
      tx,
      email,
      name,
      studentTickets,
      nonStudentTickets,
      shippingInfo,
      internationalShippingLineItems,
      gearOrders,
      createdAt: now,
      updatedAt: now,
    });
  } else {
    info(`processTransaction: tx:${tx} already exists. Skipping Create Transaction`);
  }

  // 2. Create Tickets
  const existingTxTickets = Tickets.find({ tx }).count();
  if (existingTxTickets === 0) {
    createTickets(tx, email, 'STUDENT', studentTickets);
    createTickets(tx, email, 'NONSTUDENT', nonStudentTickets);
    sendTickets(tx, email);
  } else {
    info(`processTransaction: Tickets for tx:${tx} already exists. Skipping Create Tickets`);
  }

  // 3. Create GearOrders
  const existingGearOrders = GearOrders.find({ tx }).count();
  if (existingGearOrders === 0) {
    createGearOrders(tx, email, gearOrders);
  } else {
    info(`processTransaction: GearOrders for tx:${tx} already exists. Skipping Create GearOrders`);
  }
};

function createTickets(tx, email, type, qty) {
  for (let i = 0; i < qty; i++) {
    createTicket(tx, email, type);
  }
};

function createTicket(tx, email, type) {
  // 1. Generate new code
  let newCode = makeCode(type);

  // 2. While this code is already in use, generate another
  while ( Boolean(Tickets.findOne({ code: newCode })) ) {
    newCode = makeCode(type);
  }

  // 3. Create ticket
  Tickets.insert({
    tx: tx,
    boughtBy: email,
    type: type,
    code: newCode,
    redeemed: false,
    redeemedBy: null,
  });
};

function makeCode(type) {
  return `${type}${Random.hexString(10)}`.toUpperCase();
};

function createGearOrders(tx, email, gearOrders) {
  const now = new Date();
  gearOrders.forEach((gearOrder) => {
    const { itemcode, color, logo_color: logoColor, size, qty, amount } = gearOrder;
    GearOrders.insert({
      tx,
      email,
      itemcode: itemcode,
      color,
      logoColor,
      size,
      qty: parseInt(qty),
      amount: parseFloat(amount),
      createdAt: now,
      updatedAt: now,
    });
  });
}
