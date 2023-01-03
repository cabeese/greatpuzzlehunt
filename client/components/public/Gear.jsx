import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';

import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { Container, Segment, Header, Icon, Modal, Grid, List, Card, Image } from 'semantic-ui-react';
import LinkButton from '../imports/LinkButton';

const { eventYear, gearSaleEnd } = Meteor.settings.public;

const link = `https://commerce.cashnet.com/TheGreatPuzzleHunt${eventYear}`;

const s3_prefix = `https://gph-distributed.s3.us-west-2.amazonaws.com/${eventYear}/gear/`;

const buyButton = (  
  <LinkButton as='a' href={link}
    size="huge" color="orange" target="_blank"
    icon={<Icon name="shopping cart" />}
    content="Buy"
  />
);

const xxlStr = ", +$2 for 2XL or larger.";

const forward = {
  "ctm": 1,
  "ctw": 1,
  "cty": 1,
  "btm": 1,
  "btw": 1,
  "lstw": 1,
  "lstm": 1,
  "fcu": 1,
  "hu": 0,
  "hy": 0,
  "qzu": 0
};

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
};

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
  "ctm": "$20" + xxlStr,
  "ctw": "$20" + xxlStr,
  "cty": "$20" + xxlStr,
  "btm": "$20" + xxlStr,
  "btw": "$20" + xxlStr,
  "lstw": "$25" + xxlStr,
  "lstm": "$25" + xxlStr,
  "fcu": "$30" + xxlStr,
  "hu": "$35" + xxlStr,
  "hy": "$35" + xxlStr,
  "qzu": "$35" + xxlStr
};

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
};

const style_colors = {
  "ctm": ["Black", "Dark Chocolate", "Forest", "Navy", "Purple"],
  "ctw": ["Black", "Dark Heather", "Navy", "Purple"],
  "cty": ["Black", "Forest", "Navy", "Purple"],
  "btm": ["Black", "Charcoal", "Heathered Brown", "Heathered Charcoal", "Heathered Navy"],
  "btw": ["Black", "Charcoal", "Heathered Brown", "Heathered Charcoal", "Heathered Navy"],
  "lstm": ["Black", "Dark Chocolate", "Dark Heather", "Forest Green", "Navy", "Purple"],
  "lstw": ["Black", "Navy"],
  "fcu": ["Black", "Dark Chocolate", "Forest Green", "Navy", "Purple"],
  "hu": ["Black", "Dark Chocolate", "Dark Heather", "Forest Green", "Navy", "Purple"],
  "hy": ["Black", "Forest Green", "Navy", "Purple"],
  "qzu": ["Black", "Black Heather", "Forest Green", "J Navy", "Vintage Htr Navy"]
};

Gear = class Gear extends Component {

  constructor(props) {
    super(props);

    this.state = {
      open: false,
      front: "",
      back: "",
      code: "",
      title: "",
      size: "",
      materials: "",
      colors: []
      //swatches: ""
    };
  }

  onClose = () => this.setState({open: false});

  gearDetails(e) {
    
    let str = e.target.src;
    str = str.split("").reverse().join("");
    str = str.substring(5, str.indexOf('/'));
    str = str.split("").reverse().join("");
  
    this.setState({
                  open: true,
                  front: `${s3_prefix}${str}f.jpg`,
                  back: `${s3_prefix}${str}b.jpg`,
                  code: str,
                  //swatches: "/img/gear/swatches/" + str + ".png",
                  colors: style_colors[str],
                  size: sizes[str],
                  title: titles[str],
                  price: prices[str],
                  materials: materials[str]});
  }

  isTall() {
    return window.innerWidth < window.innerHeight - 200;
  }

  getImageCard(code) {
    let title = titles[code];
    let path = `${s3_prefix}${code}${forward[code] ? "f.jpg" : "b.jpg"}`;
    return (
      <div className="gearitem ui card link" style={{verticalAlign: "top", display: "inline-block", marginLeft: "0.5em"}}>
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
                  {
                    Object.keys(this.state.colors).map((idx) => {
                      let color_name = this.state.colors[idx];
                      return (
                        <div className="gearitem ui card" key={idx} style={{verticalAlign: "top", display: "inline-block", marginLeft: "1em"}}>
                          <img style={{maxHeight: "100%", maxWidth: "100%", verticalAlign: "bottom"}} src={`${s3_prefix}${this.state.code}_${color_name.toLowerCase().replaceAll(" ", "")}.jpg`}/>
                          <Card.Content>
                            <Card.Description>
                              { color_name }
                            </Card.Description>

                          </Card.Content>

                        </div>
                      );
                    }) 
                  }
                  <img width="100%" src={this.state.swatches}></img>
                </Grid.Column>
                
            </Grid>
            </Modal.Content>
        </Modal>

        <Segment basic>
          <PuzzlePageTitle title="Gear" />
          Gear store closes { gearSaleEnd }.
          <br />
          Shirts will be ordered on Monday, April 17 and assuming no supply chain delays, should be shipped out or ready for pick-up the week of April 24.
          <br /><br />
          Prices on varying styles range from $20&ndash;$35, additional $2 for extended sizes.
          <br /><br />
          Click on each item for more information.
          <br /><br />

          <Grid stackable>
            <Grid.Row>
              <Grid.Column width={7}>
                <Header as="h2">Shipping Options</Header>
                
                <List bulleted>
                  <List.Item><strong>Pick up on campus</strong>: FREE</List.Item>
                  <List.Item>
                    <strong>Domestic Shipping</strong>:
                    <List.List>
                      <List.Item>For any T-shirt (long or short sleeve): $5/shirt</List.Item>
                      <List.Item>For any sweatshirts (crew, hoodie, &frac14; zip): $8/sweatshirt</List.Item>
                    </List.List>
                  </List.Item>
                  <List.Item>
                    <strong>International Shipping</strong>:
                    <List.List>
                      <List.Item>For any shirt (T-shirt or sweatshirt): $25/shirt</List.Item>
                    </List.List>
                  </List.Item>
                </List>
              </Grid.Column>
              <Grid.Column width={5}>
                  <Image src='https://gph-distributed.s3.us-west-2.amazonaws.com/2023/gear/shirt_design.png'/>
              </Grid.Column>
            </Grid.Row>
          </Grid>
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
