import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';

import { Container, Segment, Header, Icon } from 'semantic-ui-react';
import LinkButton from '../imports/LinkButton';

const buyButton = (
  <LinkButton as='a' href="https://commerce.cashnet.com/cashnetg/selfserve/BrowseCatalog.aspx"
    size="huge" color="orange" target="_blank"
    icon={<Icon name="shopping cart" />}
    content="Buy"
  />
);

const xxlStr = ", +$2 for 2XL or larger.";

const titles = {
  "ctm": "Men's Cotton Tee",
  "ctw": "Women's Cotton Tee",
  "cty": "Youth Cotton Tee",
  "btm": "Men's Cotton/Poly Blend Tee",
  "btw": "Women's Cotton/Poly Blend Tee",
  "lstw": "Women's Long Sleeve Cotton Tee",
  "lstm": "Men's Long Sleeve Cotton Tee",
  "fcu": "Unisex Crew Sweatshirt",
  "hu": "Unisex Hoodie Sweatshirt", 
  "hy": "Youth Hoodie",
  "qzu": "Unisex Quarter-zip Collar Sweatshirt",
}

const materials = {
  "ctm": "100% Cotton",
  "ctw": "100% Cotton",
  "cty": "100% Cotton",
  "btm": "50/50 Cotton/Polyester",
  "btw": "50/50 Cotton/Polyester",
  "lstw": "100% Cotton",
  "lstm": "100% Cotton",
  "fcu": "50/50 Cotton/Polyester",
  "hu": "50/50 Cotton/Polyester",
  "hy": "50/50 Cotton/Polyester",
  "qzu": "50/50 Cotton/Polyester"
};

const prices = {
  "ctm": "$14" + xxlStr,
  "ctw": "$14" + xxlStr,
  "cty": "$14" + xxlStr,
  "btm": "$15" + xxlStr,
  "btw": "$15" + xxlStr,
  "lstw": "$17" + xxlStr,
  "lstm": "$17" + xxlStr,
  "fcu": "$20" + xxlStr,
  "hu": "$25" + xxlStr,
  "hy": "$25" + xxlStr,
  "qzu": "$30" + xxlStr
}

const sizes = {
  "ctm": "S-5XL",
  "ctw": "XS-3XL",
  "cty": "XS-L",
  "btm": "XS-4XL",
  "btw": "XS-4XL",
  "lstw": "S-3XL",
  "lstm": "S-5XL",
  "fcu": "S-5XL",
  "hu": "S-5XL",
  "hy": "S-XL",
  "qzu": "S-3XL"
}

Gear = class Gear extends Component {

  gearDetails(e) {
    str = e.target.src;
    str = str.split("").reverse().join("");
    str = str.substring(5, str.indexOf('/'));
    str = str.split("").reverse().join("");
    details = document.getElementById("gearDetails");
    
    front = details.getElementsByTagName("img")[0];
    back = details.getElementsByTagName("img")[1];
    swatches = details.getElementsByTagName("img")[2];
    front.src = "/img/gear/" + str + "f.jpg";
    back.src = "/img/gear/" + str + "b.jpg";
    swatches.src = "/img/gear/swatches/" + str + ".png";
    document.getElementById("sizes").innerHTML = sizes[str];
    document.getElementById("title").innerHTML = titles[str];
    document.getElementById("price").innerHTML = prices[str];
    document.getElementById("materials").innerHTML = materials[str];

    details.style.display = "block";

    details.style.top = window.innerHeight / 2 - $("#gearDetails").innerHeight() / 2 + "px";
    details.style.left = window.innerWidth / 2 - $("#gearDetails").innerWidth() / 2 + "px";
  }

  closeDetails(e) {
    details = document.getElementById("gearDetails");
    details.style.display = "none";
  }

  showBack() {
    front.style.display = "none";
    back.style.display = "block";
  }

  showFront() {
    front.style.display = "block";
    back.style.display = "none";
  }

  componentDidMount() {
    window.addEventListener("resize", this.updateDimensions.bind(this));
    front = document.getElementById("front");
    back = document.getElementById("back");
    front.addEventListener("mouseover", this.showBack);
    front.addEventListener("touchstart", this.showBack);
    back.addEventListener("mouseout", this.showFront);
    back.addEventListener("touchend", this.showFront);
  }

  isTall() {
    return window.innerWidth < window.innerHeight - 200;
  }

  updateDimensions() {
    this.forceUpdate();
    details = document.getElementById("gearDetails");
    details.style.top = window.innerHeight / 2 - $("#gearDetails").innerHeight() / 2 + "px";
    details.style.left = window.innerWidth / 2 - $("#gearDetails").innerWidth() / 2 + "px";
    let open = details.style.display == "block";
    details.style.display = "block";
    details.style.width = "auto";
    details.style.height = "auto";
    
    closeButton = document.getElementById("close");
    closeButton.style.top = details.style.top;
    closeButton.style.left = details.style.left;

    if (!open) {
      details.style.display = "none";
    }
 

  }

  getImageCard(code) {
    title = titles[code];
    path = "/img/gear/" + code + "f.jpg";
    return (
      <div className="gearitem ui card" style={{width: "30%", display: "inline-block", marginLeft: "20px"}}>
        <img style={{maxHeight: "100%", maxWidth: "100%", verticalAlign: "bottom"}} onClick={this.gearDetails} src={path}></img>
        <div className="content" style={{height: "75px"}}>
          <span> {title} </span>
        </div>
      </div>
    );
  }

  render() {
    let height = this.isTall() ? "" : window.innerHeight - 200 - 40 + "px";

    return (
      <Container className="section">


        <div id="gearDetails" style={{padding: "20px", zIndex: "1000", position: "fixed", left: 0, top: 0, display: "none", backgroundColor: "white", borderRadius: "5px", boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.25)"}}>
            <i id="close" className="close icon" onClick={this.closeDetails}></i>
            <div style={{display: "grid", gridTemplateColumns: "auto auto", height: height}}>
              <div style={{height: "calc(100% - 20px)", minHeight: 0, minWidth: 0}}>
                  <img id="front" src="/img/gear/btmf.jpg" style={{objectFit: "contain", maxHeight: "100%", maxWidth: "100%"}} />
                  <img id="back" src="/img/gear/btmb.jpg" style={{display: "none", objectFit: "contain", maxHeight: "100%", maxWidth: "100%"}} />
                <p>Hover or tap on image to change photo.</p>
              </div>
              <div style={{paddingLeft: "10px", verticalAlign: "top", display:"inline-block", minWidth: 0, minHeight: 0, flexBasis: 0, flexGrow: 1}}>
                <Header id="title" as="h2">Men's Cotton Tee</Header>
                <p id="price"></p>
                <p>Size range: <span id="sizes"></span></p>
                <p>Material: <span id="materials"></span></p>
                <Header as="h2">Colors:</Header>
                <div style={{height: "50%", overflowY: "auto", overflowX: "hidden"}}>
                  <img style={{verticalAlign: "top", width: "100%"}} className="swatches" src="/img/gear/swatches/btm.png"></img>
                </div>
                <br />
                <center>
                  { buyButton }
                </center>
              </div>
            </div>
        </div>
        <Segment basic>
          <PuzzlePageTitle title="Gear" />
          Prices on varying styles range from $14&ndash;$30, additional $2 for extended sizes. <b>Cool swag included with every shipment!</b>

          <Header as="h2">Shipping</Header>
          For items shipped <b>domestically</b>, SHIPPING IS FREE (we are covering the cost!).<br />
          For items shipped <b>internationally</b>, the charge is $8 per T-shirt &amp; $15 per Sweatshirt (we are covering most of the cost!).
          <br /><br />
          Unfortunately, if shipping is not added to international orders, we will be unable to ship and will refund the purchase.

          <Header size="medium">Shirts</Header>
          { this.getImageCard("btm") }
          { this.getImageCard("btw") }
          { this.getImageCard("ctm") }
          { this.getImageCard("ctw") }
          { this.getImageCard("lstm") }
          { this.getImageCard("lstw") }
          { this.getImageCard("cty") }

          <Header size="medium">Outerwear</Header>

          { this.getImageCard("fcu") }
          { this.getImageCard("hu") }
          { this.getImageCard("hy") }
          { this.getImageCard("qzu") }

        </Segment>
      </Container>
    )
  }

}
