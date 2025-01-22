import * as util from 'util'
import { Meteor } from 'meteor/meteor';

const HUMAN_ITEMCODES = {
    "MA4--YTEE": "Youth Cotton T-Shirt",
    "MA4-MENST": "Mens Cotton T-Shirt",
    "MA4-MENTEEXL": "Mens Cotton T-Shirt",
    "MA4-WTEESXL": "Womens Cotton T-Shirt",
    "MA4-WTSHIRT": "Womens Cotton T-Shirt",
    "MA4-MTEELSXL": "Mens Long Sleeve T-Shirt",
    "MA4-MTSHIRTL": "Mens Long Sleeve T-Shirt",
    "MA4-WTEELSXL": "Womens Long Sleeve T-Shirt",
    "MA4-WTSHIRTL": "Womens Long Sleeve T-Shirt",
    "MA4-MTEEBXL": "Mens 50-50 Blend T-Shirt",
    "MA4-MTSHIRTB": "Mens 50-50 Blend T-Shirt",
    "MA4-WTEEBXL": "Womens 50-50 Blend T-Shirt",
    "MA4-WTSHIRTB": "Womens 50-50 Blend T-Shirt",
    "MA4-SWEATER": "Unisex Hoodie Sweatshirt",
    "MA4-SWEATXL": "Unisex Sweatshirt",
    "MA4-YTSHIRT": "Youth Hoodie Sweatshirt",
    "MA4-ZCS": "Unisex Quarter Zipper Sweatshirt",
    "MA4-CSU": "Unisex Crew Sweatshirt",
    "MA4-BVNT": "Women's Blend V-Neck T",
    "MA4-HFZS": "Unisex Full Zip Hooded Sweatshirt",
    "MA4-DONA": "Donation",
}

const IN_PERSON_TICKET_CODES = [
	'MA4-SREG',
	'MA4-NSREG',
	'MA4-SREGD',
	'MA4-NSREGD',
];
const VIRTUAL_TICKET_CODES = [
	'MA4-VREG',
	'MA4-VNSREG',
	'MA4-VDNREG',
	'MA4-VDREG',
];

export function convertCashnet(reqBody) {
    let params = {}

    for (let key in reqBody) {
        if (key === "@SOLID") continue;
        if (reqBody[key] === "@SOLID") continue;

        params[key] = reqBody[key]
    }

    const tx = params["tx"];
    if(!tx){
        throw new Error(`Invalid or missing transaction number tx=${tx}`);
    }

    let email = params["EMAIL_G"]
    if (!email) throw new Error("Missing 'email' property");
    email = email.toLowerCase()

    let fname = params["FNAME"]
    let lname = params["LNAME"]
    let name = `${fname} ${lname}`;
    if (!fname || !lname) {
        Meteor.logger.error(`CashNet request ${tx} missing (part of) 'name' property`);
    }
    name = name.toLowerCase()
    let tickets = [];

    let items = {
        name,
        gear: [],
        internationalShippingLineItems: [],
        domesticShippingLineItems: [],
    }

    let txShippingInfo = parseShipping(params);

    let cnt = parseInt(params["itemcnt"], 10)

    for (let i = 1; i <= cnt; i++) {
        let itemcode = params[`itemcode${i}`]

        if (itemcode && IN_PERSON_TICKET_CODES.indexOf(itemcode) > -1) {
            let isStudent = itemcode.indexOf("MA4-SREG") !== -1;
            let qty = parseInt(params[`qty${i}`], 10);
            tickets.push({isStudent, inPerson: true, qty});
        } else if (itemcode && VIRTUAL_TICKET_CODES.indexOf(itemcode) > -1) {
            let isStudent = itemcode.indexOf("N") === -1;
            let qty = parseInt(params[`qty${i}`], 10);
            tickets.push({isStudent, inPerson: false, qty});
        } else {
            parseGear(params, items, i)
        }
    }

    const donations = getTotalDonations(items.gear);

    return {
        tx,
        email,
        name,
        tickets,
        donations,
        shippingInfo: txShippingInfo,
        gear: items.gear
    }
}

function parseShipping(params) {
    const map = {
        "MA4-SHIPNAME": "name",
        "MA4-SHIPADD1": "addr1",
        "MA4-SHIPADD2": "addr2",
        "MA4-SHIPCITY": "city",
        "MA4-SHIPSTATE": "state",
        "MA4-SHIPZIP": "zip",
        "MA4-COUNTRY": "country",
    };
    let ret = {};

    for(let key in map){
        if(params[key]){
            ret[map[key]] = params[key];
        }
    }

    return ret;
}

function parseIntlShipping(params, items, txShippingInfo, i) {
    const qty = parseInt(params[`qty${i}`]);
    const amount = parseInt(params[`amount${i}`]);
    txShippingInfo.internationalCount += 1;
    txShippingInfo.internationalTotal += amount;
    items.internationalShippingLineItems.push({
        qty,
        amount,
        itemIndex: i,
    });
}

function parseDomShipping(params, items, txShippingInfo, i) {
    const qty = parseInt(params[`qty${i}`]);
    const amount = parseInt(params[`amount${i}`]);
    txShippingInfo.domesticCount += 1;
    txShippingInfo.domesticTotal += amount;
    items.domesticShippingLineItems.push({
        qty,
        amount,
        itemIndex: i,
    });
}

// Users can either add a donation as its own line item or may add a donation
// to a shirt line item.
function getTotalDonations(gearItems) {
  return gearItems.reduce((acc, item) => {
    if (item.itemcode == "Donation") {
      return acc + item.amount;
    } else {
      return acc + item.donation;
    }
  }, 0);
}

function parseGear(params, items, i) {
    let item_code = params[`itemcode${i}`]
    let item_name = HUMAN_ITEMCODES[item_code]
    const amount = params[`amount${i}`];
    const cost = parseInt(amount, 10)
    if(!item_name){
        Meteor.logger.warn(`Received unknown gear order with itemcode: ${item_code}`)
        item_name = `(**UNKNOWN** - ${item_code})`
    }
    if (isNaN(amount)) {
      Meteor.logger.warn(`'amount' (cost) value for ${item_code} was NaN. ` +
                         `Got '${amount}'`);
    }
    let gearItem = {
        itemcode: item_name,
        qty: parseInt(params[`qty${i}`]),
        amount: cost,
        size: null,
        color: null,
        shipping: null,
        donation: 0,
    };

    for (let k in params) {
        if (!k.endsWith(`type${i}`)) continue;

        let ref = k.match(/\d+/)[0]
        let refType = params[`ref${ref}type${i}`]
        let refValKey = `ref${ref}val${i}`;
        let refVal = null;
        if (params[refValKey]){
            refVal = params[refValKey].toLowerCase()
        }

        if (refType.includes("MA4-XS-") ||
            refType.includes("MA4-S-") ||
            refType.includes("MA4-MENLS") ||
            refType.includes("ALL-SIZEXS-XL") ||
            refType.includes("MA4-MENST") ||
            refType.includes("MA4-SIZE XS-L") ||
            refType.includes("MA4-BVNTSIZE") ||
            refType.includes("MA4-SIZE XS-L") ||
            refType.includes("MA4-SIZEXS5XL") ||
            refType.includes("ALL-S-")) {
            gearItem.size = refVal
        } else if (refType.includes("COLOR") ||
                   refType.includes("MA4-YSSHIRTC2") ||
                   refType.includes("MA4-SshirtUni") ||
                   refType.includes("MA4-YTshirtC") ||
                   refType.includes("MA4-WLSHIRT") ||
                   refType.includes("MA4-WBSHIRT") ||
                   refType.includes("MA4-MBSHIRT") ||
                   refType.includes("MA4-YTSHIRTC") ||
                   refType.includes("MA4-SSHIRTUNI") ||
                   refType.includes("MA4-HFZS") ||
                   refType.includes("MA4-WOMVNECK") ||
                   refType.includes("MA4-MLSHIRT2")) {
            gearItem.color = refVal
        } else if (refType.includes("MA4-SHIP23") ||
                   refType.includes("MA4-SHIP24")) {
            gearItem.shipping = refVal;
        } else if (refType.includes("MA4-DONATE")) {
          if (isNaN(refVal)) {
            Meteor.logger.warn(`Encountered donation value of '${refVal}' ` +
                               `that is NaN on ${item_code}`);
          } else {
            gearItem.donation += parseInt(refVal, 10);
          }
        } else if (refType.includes("@BLANK") ||
                   refType.includes("ACDS-ORGURL")
                  ) {
            // pass through. Present on some; not sure what it is.
        } else {
            // We'll assume any "leftover" field(s) correspond(s) to color,
            // but we'll keep the original value(s) too just in case.
            Meteor.logger.warn(`Saw unknown gear field '${refType}=${refVal}'` +
                               ` while parsing ${item_code}`);
            if (gearItem.color == null) gearItem.color = refVal
            gearItem[refType] = refVal;
        }
    }

    items.gear.push(gearItem)
}
