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
    "MA4-SWEATER": "Unisex Sweatshirt",
    "MA4-SWEATXL": "Unisex Sweatshirt",
    "MA4-YTSHIRT": "Youth Sweatshirt",
    "MA4-ZCS": "Unisex Quarter Zipper Sweatshirt",
    "MA4-CSU": "Unisex Crew Sweatshirt",
}

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

    let name = params["NAME_G"]
    if (!name) {
        Meteor.logger.error(`CashNet request ${tx} missing 'name' property`);
        name = ""
    }
    name = name.toLowerCase()

    let items = {
        name,
        nonStudentTickets: 0,
        studentTickets: 0,
        gear: []
    }

    let shippingInfo = parseShipping(params);

    let cnt = parseInt(params["itemcnt"], 10)

    for (let i = 1; i <= cnt; i++) {
        let itemcode = params[`itemcode${i}`]

        if (itemcode === "MA3-NSREG" || itemcode === "MA4-NSREG") {
            parseNonStudentTickets(params, items, i)
        } else if (itemcode === "MA3-SREG" || itemcode === "MA4-SREG") {
            parseStudentTickets(params, items, i)
        } else if (itemcode === "MA4-INTLSHPT" || itemcode === "MA4-INTLSHPS") {
            // There may be multiple "international shipping" line items. (In
            // fact, there will be one for each gear item.) Each transaction
            // can have only one address, though, so if we find a single intl
            // shipping line item, we assume the whole order is internat'l.
            shippingInfo.isInternational = true;
        } else {
            parseGear(params, items, i)
        }
    }

    return {
        tx,
        email,
        name,
        studentTickets: items.studentTickets,
        nonStudentTickets: items.nonStudentTickets,
        shippingInfo,
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
    let ret = {
        isInternational: false,
    };

    for(let key in map){
        if(params[key]){
            ret[map[key]] = params[key];
        }
    }

    return ret;
}

function parseNonStudentTickets(params, items, i) {
    items["nonStudentTickets"] += parseInt(params[`qty${i}`], 10)
}

function parseStudentTickets(params, items, i) {
    items["studentTickets"] += parseInt(params[`qty${i}`], 10)
}

function parseGear(params, items, i) {
    let item_code = params[`itemcode${i}`]
    let item_name = HUMAN_ITEMCODES[item_code]
    if(!item_name){
        Meteor.logger.warn(`Received unknown gear order with itemcode: ${item_code}`)
        item_name = `(**UNKNOWN** - ${item_code})`
    }
    let gearItem = {
        itemcode: item_name,
        qty: params[`qty${i}`],
        amount: params[`amount${i}`],
        size: null,
        color: null,
        logo_color: null,
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
        // Currently identified size 'type' possibilities:
        // * MA4-XS-L
        // * MA4-S-5XL
        // * MA4-XS-4XL
        // * MA4-XS-3XL
        // * MA4-S-3XL
        // * MA4-XS-XL
        // * ALL-S-XL

        if (refType.includes("MA4-XS-") || refType.includes("MA4-S-") ||
            refType.includes("ALL-S-")) {
            gearItem.size = refVal
        } else if (refType.includes("LOGO")) {
            gearItem.logo_color = refVal
        } else if (refType.includes("COLOR")) {
            // Note: this needs to go after "LOGOCOLOR" handling
            gearItem.color = refVal
        } else if (refType.includes("SHIPPINGTXT")) {
            // pass through for now. there is no refVal for SHIPPINGTXT
        } else if (refType.includes("@BLANK")) {
            // pass through. Present on some; not sure what it is.
        } else {
            // We'll assume any "leftover" field(s) correspond(s) to color,
            // but we'll keep the original value(s) too just in case.
            gearItem.color = refVal
            gearItem[refType] = refVal;
        }
    }

    items.gear.push(gearItem)
}
