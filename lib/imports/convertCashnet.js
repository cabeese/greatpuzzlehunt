import * as util from 'util'

const HUMAN_ITEMCODES = {
    "MA4-YTEE": "Youth Cotton T-Shirt",
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
}

export function convertCashnet(reqBody) {
    let params = {}

    for (let key in reqBody) {
        if (key === "@SOLID") continue;
        if (reqBody[key] === "@SOLID") continue;

        params[key] = reqBody[key]
    }

    let name = (params["NAME_G"] || "").toLowerCase()
    let email = params["EMAIL_G"].toLowerCase()

    let items = {
        name,
        nonStudentTickets: 0,
        studentTickets: 0,
        gear: []
    }

    let cnt = parseInt(params["itemcnt"])

    for (let i = 1; i <= cnt; i++) {
        let itemcode = params[`itemcode${i}`]

        if (itemcode === "MA3-NSREG") {
            parseNonStudentTickets(params, items, i)
        } else if (itemcode === "MA3-SREG") {
            parseStudentTickets(params, items, i)
        } else {
            parseGear(params, items, i)
        }
    }

    let ret = {
        tx: params["tx"],
        email,
        original: params,
        items
    }

    // console.log(util.inspect(ret, false, null, true))

    return {
        tx: ret.tx,
        email: ret.email,
        name: ret.items.name,
        studentTickets: ret.items.studentTickets,
        nonStudentTickets: ret.items.nonStudentTickets,
        gear: ret.items.gear
    }
}

function parseNonStudentTickets(params, items, i) {
    items["nonStudentTickets"] += parseInt(params[`qty${i}`])
}

function parseStudentTickets(params, items, i) {
    items["studentTickets"] += parseInt(params[`qty${i}`])
}

function parseGear(params, items, i) {
    let gearItem = {
        itemcode: HUMAN_ITEMCODES[params[`itemcode${i}`]],
        qty: params[`qty${i}`],
        amount: params[`amount${i}`],
        size: null,
        color: null,
        logo_color: null
    }

    for (let k in params) {
        if (!k.endsWith(`type${i}`)) continue;

        let ref = k.match(/\d+/)[0]
        let refType = params[`ref${ref}type${i}`]
        let refVal = params[`ref${ref}val${i}`].toLowerCase()
        // Size will 'type' will now be one of:
        // * MA4-XS-L
        // * MA4-S-5XL
        // * MA4-XS-4XL
        // * MA4-XS-3XL
        // * MA4-S-3XL
        // * MA4-XS-XL

        if (refType.includes("MA4-XS-") || refType.includes("MA4-S-")) {
            gearItem.size = refVal
        } else if (refType.includes("LOGO")) {
            gearItem.logo_color = refVal
        } else {
            gearItem.color = refVal
        }
    }

    items.gear.push(gearItem)
}
