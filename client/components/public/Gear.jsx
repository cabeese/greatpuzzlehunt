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
  "ctw": "XS-4XL",
  "cty": "XS-L",
  "btm": "XS-4XL",
  "btw": "XS-4XL",
  "lstw": "XS-4XL",
  "lstm": "S-5XL",
  "fcu": "S-5XL",
  "hu": "XS-5XL",
  "hy": "XS-XL",
  "qzu": "S-3XL"
};

const styleColors = {
  "ctm": ['Ash', 'Azalea', 'Cornsilk', 'Gravel', 'Heather Radiant Orchid', 'Heliconia', 'Ice Grey', 'Light Blue', 'Light Pink', 'Mint Green', 'Neon Green', 'Sky', 'Sport Grey', 'White', 'Yellow Haze'],
  "ctw": ['Ash', 'Candy Pink', 'Light Blue', 'Neon Pink', 'White'],
  "cty": ['Ash', 'Azalea', 'Gold', 'Heliconia', 'Light Blue', 'Light Pink', 'Mint Green', 'Neon Green', 'Sky', 'Sport Grey', 'White', 'Yellow Haze'],
  "btm": ['Awareness Pink Heather', 'Blush Frost', 'Heathered Dusty Sage', 'Light Heather Grey', 'White'],
  "btw": ['Light Heather Grey', 'White'],
  "lstm": ['Ash', 'Gold', 'Irish Green', 'Light Blue', 'Light Pink', 'Natural', 'Safety Green', 'Sand', 'Sport Grey', 'White'],
  "lstw": ['Aquatic Blue', 'Candy Pink', 'White'],
  "fcu": ['Ash', 'Gold', 'Heliconia', 'Irish Green', 'Light Blue', 'Light Pink', 'Safety Green', 'Sand', 'Sport Grey', 'White'],
  "hu": ['Ash', 'Azalea', 'Gold', 'Heliconia', 'Irish Green', 'Light Blue', 'Light Pink', 'Mint Green', 'Orchid', 'Sand', 'Sport Grey', 'White'],
  "hy": ['Gold', 'Heliconia', 'Light Pink', 'Sport Grey', 'White'],
  "qzu": ['Ash', 'Oxford', 'White']
};

const cardColors = {
  "ctm": 'Mint Green',
  "ctw": 'Candy Pink',
  "cty": 'Sport Grey',
  "btm": 'Heathered Dusty Sage',
  "btw": 'White',
  "lstm": 'Light Blue',
  "lstw": 'Aquatic Blue',
  "fcu": 'Heliconia',
  "hu": 'Sand',
  "hy": 'Gold',
  "qzu": 'Oxford'
}

Gear = class Gear extends Component {

  constructor(props) {
    super(props);

    this.state = {
      open: false,
      code: "",
      title: "",
      size: "",
      materials: "",
      colors: []
    };
  }

  onClose = () => this.setState({open: false});

  gearDetails(e) {
    let url = e.target.src;
    let filename = url.split('/').slice(-1).pop()
    let name = filename.substring(0, filename.indexOf('_'))
  
    this.setState({
                  open: true,
                  code: name,
                  colors: styleColors[name],
                  size: sizes[name],
                  title: titles[name],
                  price: prices[name],
                  materials: materials[name]});
  }

  getImageCard(code) {
    let title = titles[code];
    let url = this.getImageURL(code, cardColors[code])
    return (
      <div className="gearitem ui card link" style={{verticalAlign: "top", display: "inline-block", marginLeft: "0.5em"}}>
        <img style={{maxHeight: "100%", maxWidth: "100%", verticalAlign: "bottom"}} onClick={this.gearDetails.bind(this)} src={url}></img>
        <div className="content">
          <span> {title} </span>
        </div>
      </div>
    );
  }

  getImageURL(code, color) {
    return `${s3_prefix}${code}_${color.toLowerCase().replaceAll(" ", "_")}.jpg`;
  }

  render() {
    return (
      <Container className="section">
        <Modal closeIcon open={this.state.open} onClose={this.onClose}>
            <Modal.Content>
              <Grid stackable columns={2} style={{flexWrap: "wrap-reverse"}}>
                <Grid.Column width={10}>
                    {Object.keys(this.state.colors).map((idx) => {
                      let color_name = this.state.colors[idx];
                      return (
                        <div className="gearitem ui card" key={idx} style={{verticalAlign: "top", display: "inline-block", marginRight: "10px", marginTop: "0"}}>
                          <img style={{maxHeight: "100%", maxWidth: "100%", verticalAlign: "bottom"}} src={this.getImageURL(this.state.code, color_name)}/>
                          <Card.Content style={{padding: "10px"}}>
                              { color_name }
                          </Card.Content>
                        </div>
                      );
                    }) 
                  }
                  <img width="100%" src={this.state.swatches}></img>
                </Grid.Column>
                <Grid.Column width={6}>
		              <Header id="title" as="h2">{this.state.title}</Header>
                  <p> {this.state.price}</p>
                  <p>Size range: {this.state.size}</p>
                  <p>Material: {this.state.materials}</p>
		              { buyButton }
                </Grid.Column>
            </Grid>
            </Modal.Content>
        </Modal>

        <Segment basic>
          <PuzzlePageTitle title="Gear" />
          <Header as="h2">PLEASE NOTE:</Header>
          SHIRTS ARRIVE <b>AFTER</b> EVENT and are <b>NOT</b> AVAILABLE FOR PICKUP AT EVENT.
          <br /><br />
          Gear store closes { gearSaleEnd }.
          <br />
          Shirts will be ordered on Monday, April 22, 2024, and assuming no supply chain delays, should be shipped out or ready for pick-up the week of May 6, 2024.
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
                  <Image src={`${s3_prefix}shirt_design.png`}/>
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
