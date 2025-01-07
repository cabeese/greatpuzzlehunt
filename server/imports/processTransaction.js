import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import {
  map,
  extend,
  omit
} from 'lodash';

import { sendTickets } from '../../lib/imports/sendTickets';

const USING_TICKET_CODES = false;

export default async function processTransaction(txData) {
  const { info, logobj } = Meteor.logger;
  const now = new Date();

  const {
    tx,
    email,
    name,
    gear,
    tickets,
    donations,
    shippingInfo,
  } = txData;

  const gearOrders = gear;

  info(`Processing transaction "${tx}" from ${email}`);
  info("Gear Orders:")
  logobj(gearOrders);
  if (USING_TICKET_CODES) {
    info("Tickets:");
    logobj(tickets);
  }

  /*
  Important Note:
  For Indempotency we check if transactions/tickets/gear orders have already
  been created with this transaction code. If they have, we skip inserting new
  documents. Every transaction will have a unique tx code.
  */

  // 1. Create Transaction
  // TODO: this should probably use .findOneAsync() instead. See
  // https://forums.meteor.com/t/most-performant-way-to-check-for-an-existing-document-in-a-collection/61647/3
  const existingTransactions = await Transactions.find({ tx }).countAsync();
  if (existingTransactions === 0) {
    Transactions.insert({
      tx,
      email,
      name,
      tickets,
      shippingInfo,
      gearOrders,
      donations,
      createdAt: now,
      updatedAt: now,
    });
  } else {
    info(`processTransaction: tx:${tx} already exists. Skipping Create Transaction`);
  }

  // 2. Create Tickets
  if (USING_TICKET_CODES) {
    // TODO: should this also use findOneAsync()?
    const existingTxTickets = await Tickets.find({ tx }).countAsync();
    if (existingTxTickets === 0) {
      tickets.forEach(async ticket => {
        await createTickets(tx, email, ticket.isStudent, ticket.inPerson, ticket.qty);
      });
      await sendTickets(tx, email);
    } else {
      info(`processTransaction: Tickets for tx:${tx} already exists. Skipping Create Tickets`);
    }
  }

  // 3. Create GearOrders
  // TODO: should this also use findOneAsync()?
  const existingGearOrders = await GearOrders.find({ tx }).countAsync();
  if (existingGearOrders === 0) {
    await createGearOrders(tx, email, gearOrders);
  } else {
    info(`processTransaction: GearOrders for tx:${tx} already exists. Skipping Create GearOrders`);
  }
};

async function createTickets(tx, email, isStudent, inPerson, qty) {
  for (let i = 0; i < qty; i++) {
    await createTicket(tx, email, isStudent, inPerson);
  }
};

async function createTicket(tx, email, isStudent, inPerson) {
  // 1. Generate new code
  const prefix = (inPerson ? "INPR" : "VIRT") + (isStudent ? "STUDENT" : "NONSTUDENT");
  let newCode = makeCode(prefix);

  // 2. While this code is already in use, generate another
  while ( Boolean(await Tickets.findOneAsync({ code: newCode })) ) {
    newCode = makeCode(prefix);
  }

  // 3. Create ticket
  await Tickets.insertAsync({
    tx: tx,
    boughtBy: email,
    type: isStudent ? "STUDENT" : "NONSTUDENT",
    isStudent: isStudent,
    inPerson: inPerson,
    code: newCode,
    redeemed: false,
    redeemedBy: null,
  });
  Meteor.logger.info(`Created ticket code ${newCode} for user ${email}`);
};

function makeCode(prefix) {
  return `${prefix}${Random.hexString(10)}`.toUpperCase();
};

async function createGearOrders(tx, email, gearOrders) {
  const now = new Date();
  gearOrders.forEach(async (gearOrder) => {
    const { itemcode, color, logo_color: logoColor, size, qty, amount,
            shipping } = gearOrder;
    await GearOrders.insertAsync({
      tx,
      email,
      itemcode: itemcode,
      color,
      logoColor,
      size,
      shipping,
      qty: parseInt(qty),
      amount: parseFloat(amount),
      createdAt: now,
      updatedAt: now,
    });
  });
}
