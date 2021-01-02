import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';

import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css"

import { Container, Segment, Header, Icon, Modal, Grid } from 'semantic-ui-react';
import LinkButton from '../imports/LinkButton';

const { eventYear } = Meteor.settings.public;

const link = `https://commerce.cashnet.com/TheGreatPuzzleHunt${eventYear}`;

const buyButton = (  
  <LinkButton as='a' href={link}
    size="huge" color="orange" target="_blank"
    icon={<Icon name="shopping cart" />}
    content="Buy"
  />
);

const xxlStr = ", +$2 for 2XL or larger.";

const forward = {
  "ctm": 0,
  "ctw": 1,
  "cty": 1,
  "btm": 0,
  "btw": 0,
  "lstw": 0,
  "lstm": 1,
  "fcu": 0,
  "hu": 1,
  "hy": 1,
  "qzu": 1
}

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

  constructor(props) {
    super(props);

    this.state = {
      open: false,
      front: "",
      back: "",
      title: "",
      size: "",
      materials: "",
      swatches: ""
    };
  }

  onClose = () => this.setState({open: false});

  gearDetails(e) {
    
    str = e.target.src;
    str = str.split("").reverse().join("");
    str = str.substring(5, str.indexOf('/'));
    str = str.split("").reverse().join("");
  
    this.setState({
                  front: "/img/gear/" + str + "f.jpg",
                  back: "/img/gear/" + str + "b.jpg",
                  swatches: "/img/gear/swatches/" + str + ".png",
                  size: sizes[str],
                  title: titles[str],
                  price: prices[str],
                  materials: materials[str]});

    this.setState({open: true});
  }

  isTall() {
    return window.innerWidth < window.innerHeight - 200;
  }

  getImageCard(code) {
    title = titles[code];
    path = "/img/gear/" + code + (forward[code] ? "f.jpg" : "b.jpg");
    return (
      <div className="gearitem ui card link" style={{verticalAlign: "top", display: "inline-block", marginLeft: "20px"}}>
        <img style={{maxHeight: "100%", maxWidth: "100%", verticalAlign: "bottom"}} onClick={this.gearDetails.bind(this)} src={path}></img>
        <div className="content">
          <span> {title} </span>
        </div>
      </div>
    );
  }

  render() {
    let settings = {
      arrows: false,
      dots: true,
      autoplay: true,
      autoplaySpeed: 5000,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      dotsClass: "carousel-dots"
    }

    return (
      <Container className="section">
        <Modal closeIcon open={this.state.open} onClose={this.onClose}>
            <Modal.Content>
              <Grid stackable columns={2}>
                <Grid.Column width={6}>
                <Slider {...settings}>
                  <img src={this.state.front} />
                  <img src={this.state.back} />
                </Slider>
                  <br /><br />
                  <center>
                  { buyButton }
                </center>
                </Grid.Column>
                <Grid.Column width={10}>
                  <Header id="title" as="h2">{this.state.title}</Header>
                  <p> {this.state.price}</p>
                  <p>Size range: {this.state.size}</p>
                  <p>Material: {this.state.materials}</p>
                  <Header as="h2">Colors:</Header>
                  <img width="100%" src={this.state.swatches}></img>
                </Grid.Column>
                
            </Grid>
            </Modal.Content>
        </Modal>

        <Segment basic>
          <PuzzlePageTitle title="Gear" />
          Prices on varying styles range from $14&ndash;$30, additional $2 for extended sizes. <b>Cool swag included with every shipment!</b>
          <br /><br />
          Click on each item for more information.

          <Header as="h2">Shipping</Header>
          For items shipped <b>domestically</b>, SHIPPING IS FREE (we are covering the cost!).<br />
          For items shipped <b>internationally</b>, the charge is $8 per T-shirt &amp; $15 per Sweatshirt (we are covering most of the cost!).
          <br /><br />
          Unfortunately, if shipping is not added to international orders, we will be unable to ship and will refund the purchase.

          <Header size="medium">Shirts</Header>
          { this.getImageCard("ctm") }
          { this.getImageCard("ctw") }
          { this.getImageCard("cty") }
          { this.getImageCard("btm") }
          { this.getImageCard("btw") }
          { this.getImageCard("lstm") }
          { this.getImageCard("lstw") }

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
