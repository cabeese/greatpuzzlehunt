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

const additionalCharges = (
  <table className='charge-table'>
    <thead>
      <tr>
        <th>Size</th>
        <th>Additional Charge</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>2XL</td>
        <td>$2</td>
      </tr>
      <tr>
        <td>3XL</td>
        <td>$3</td>
      </tr>
      <tr>
        <td>4XL</td>
        <td>$4</td>
      </tr>
      <tr>
        <td>5XL</td>
        <td>$5</td>
      </tr>
    </tbody>
  </table>
)
// const xxlStr = "+$2 for 2XL, +$3 for 3XL, +$4 for 4XL, +$5 for 5XL";

const titles = {
  "ctm": "Men's Cotton Tee",
  "ctw": "Women's Cotton Tee",
  "cty": "Youth Cotton Tee",
  "btm": "Men's Cotton/Poly Blend Tee",
  "btw": "Women's Cotton/Poly Blend Tee",
  "bvtw": "Women's Cotton/Poly Blend V-Neck Tee",
  "lstw": "Women's Long Sleeve Cotton Tee",
  "lstm": "Men's Long Sleeve Cotton Tee",
  "csu": "Unisex Crew Sweatshirt",
  "hu": "Unisex Hoodie Sweatshirt",
  "hy": "Youth Hoodie",
  "huz": "Unisex Full Zip Hooded Sweatshirt",
  "qzu": "Unisex Quarter-zip Collar Sweatshirt",
};

const materials = {
  "ctm": "100% Cotton",
  "ctw": "100% Cotton",
  "cty": "100% Cotton",
  "btm": "50/50 Cotton/Polyester",
  "btw": "50/50 Cotton/Polyester",
  "bvtw": "50/50 Cotton/Polyester",
  "lstw": "100% Cotton",
  "lstm": "100% Cotton",
  "csu": "50/50 Cotton/Polyester",
  "hu": "50/50 Cotton/Polyester",
  "hy": "50/50 Cotton/Polyester",
  "huz": "50/50 Cotton/Polyester",
  "qzu": "50/50 Cotton/Polyester"
};

const prices = {
  "ctm": "$20",
  "ctw": "$20",
  "cty": "$20",
  "btm": "$22",
  "btw": "$22",
  "bvtw": "$22",
  "lstw": "$25",
  "lstm": "$25",
  "csu": "$30",
  "hu": "$35",
  "hy": "$35",
  "huz": "$40",
  "qzu": "$40"
};

const sizes = {
  "ctm": "S-5XL",
  "ctw": "XS-4XL",
  "cty": "XS-L",
  "btm": "XS-4XL",
  "btw": "XS-4XL",
  "bvtw": "XS-4XL",
  "lstw": "XS-4XL",
  "lstm": "S-5XL",
  "csu": "XS-5XL",
  "hu": "XS-5XL",
  "hy": "XS-XL",
  "huz": "S-5XL",
  "qzu": "S-3XL"
};

const styleColors = {
  "ctm": ['Black', 'Blackberry', 'Charcoal', 'Cobalt', 'Dark Chocolate', 'Dark Heather', 'Forest Green', 'Lilac', 'Maroon', 'Midnight', 'Military Green', 'Navy', 'Purple'],
  "ctw": ['Athletic Maroon', 'Dark Heather Grey', 'Jet Black', 'Navy', 'Purple', 'Royal'],
  "cty": ['Black', 'Charcoal', 'Cobalt', 'Dark Chocolate', 'Dark Heather', 'Forest Green', 'Maroon', 'Military Green', 'Navy', 'Purple'],
  "btm": ['Black', 'Charcoal', 'Deep Turquoise Fleck', 'Heathered Brown', 'Heathered Eggplant', 'Heathered Forest Green', 'Heathered Navy', 'Raspberry Fleck', 'Royal Frost',],
  "btw": ['Black', 'Charcoal', 'Heathered Eggplant', 'Heathered Navy', 'Heathered Olive', 'Heathered Teal'],
  "bvtw": ['Black', 'Charcoal', 'Deep Turquoise Fleck', 'Heathered Navy', 'Heathered Olive', 'Heathered Purple', 'Raspberry Fleck'],
  "lstm": ['Black', 'Charcoal', 'Dark Chocolate', 'Dark Heather', 'Forest Green', 'Maroon', 'Military Green', 'Navy', 'Purple', 'Royal'],
  "lstw": ['Athletic Maroon', 'Dark Heather Grey', 'Jet Black', 'Navy', 'Purple', 'Royal'],
  "csu": ['Black', 'Charcoal', 'Dark Chocolate', 'Dark Heather', 'Forest', 'Maroon', 'Military Green', 'Navy', 'Purple', 'Royal'],
  "hu": ['Black', 'Charcoal', 'Dark Chocolate', 'Dark Heather', 'Forest', 'Maroon', 'Military Green', 'Navy', 'Purple', 'Royal'],
  "hy": ['Black', 'Charcoal', 'Dark Heather', 'Forest', 'Maroon', 'Navy', 'Purple', 'Royal'],
  "huz": ['Black', 'Dark Chocolate', 'Dark Heather', 'Forest', 'Maroon', 'Navy', 'Purple', 'Royal'],
  "qzu": ['Black', 'Forest Green', 'J Navy', 'Maroon', 'Royal', 'Vintage Heather Navy']
};

const cardColors = {
  "ctm": 'Blackberry',
  "ctw": 'Royal',
  "cty": 'Maroon',
  "btm": 'Deep Turquoise Fleck',
  "btw": 'Heathered Olive',
  "bvtw": 'Heathered Navy',
  "lstm": 'Black',
  "lstw": 'Athletic Maroon',
  "csu": 'Dark Chocolate',
  "hu": 'Royal',
  "hy": 'Forest',
  "huz": 'Navy',
  "qzu": 'Vintage Heather Navy'
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

  onClose = () => this.setState({ open: false });

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
      materials: materials[name]
    });
  }

  getImageCard(code) {
    let title = titles[code];
    let url = this.getImageURL(code, cardColors[code])
    return (
      <div className="gearitem ui card link" style={{ verticalAlign: "top", display: "inline-block" }}>
        <img style={{ maxHeight: "100%", maxWidth: "100%", verticalAlign: "bottom" }} onClick={this.gearDetails.bind(this)} src={url}></img>
        <Card.Content style={{ padding: "10px" }}>
          {title}
        </Card.Content>
      </div>
    );
  }

  getImageURL(code, color) {
    return `${s3_prefix}${code}_${color.toLowerCase().replaceAll(" ", "_")}.jpg`;
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
      dotsClass: "carousel-dots",
    }
    return (
      <Container className="section">
        <Modal closeIcon open={this.state.open} onClose={this.onClose}>
          <Modal.Content>
            <Grid stackable columns={2} style={{ flexWrap: "wrap" }}>


              <Grid.Column width={8}>
                <Slider {...settings}>
                  <img src={this.getImageURL(this.state.code, "black")} />
                  <img src={this.getImageURL(this.state.code, "black")} />
                </Slider>


              </Grid.Column>
              <Grid.Column width={8}>
                <Header id="title" as="h2">{this.state.title}</Header>
                <hr color="lightgrey" />
                <p> {this.state.price}</p>

                <Header as="h3">Information & Sizing</Header>
                <p><strong>Material</strong>: {this.state.materials}</p>
                <p><strong>Size range</strong>: {this.state.size}</p>
                <p>For sizes larger than XL:</p>
                {additionalCharges}
                {buyButton}
              </Grid.Column>


            </Grid>
            <div>
              <div className="gear-container">
                {Object.keys(this.state.colors).map((idx) => {
                  let color_name = this.state.colors[idx];
                  return (
                    <div className="gearitem ui card" key={idx} style={{ verticalAlign: "top", display: "inline-block" }}>
                      <img style={{ maxHeight: "100%", maxWidth: "100%", verticalAlign: "bottom" }} src={this.getImageURL(this.state.code, color_name)} />
                      <Card.Content style={{ padding: "10px" }}>
                        {color_name}
                      </Card.Content>
                    </div>
                  );
                })
                }
              </div>
            </div>
          </Modal.Content>
        </Modal>

        <Segment basic>
          <PuzzlePageTitle title="Gear" />
          <Header as="h2">PLEASE NOTE:</Header>
          SHIRTS ARRIVE <b>AFTER</b> EVENT and are <b>NOT</b> AVAILABLE FOR PICKUP AT EVENT.
          <br /><br />
          Gear store closes {gearSaleEnd} at midnight.
          <br />
          Shirts will be ordered on Monday, April 28, 2025, and assuming no supply chain delays, should be shipped out or ready for pick-up the week of May 12, 2025.
          <br /><br />
          Prices on varying styles range from $20&ndash;$40, additional charges for extended sizes.
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
                      <List.Item>For any T-shirt (long or short sleeve): $6/shirt</List.Item>
                      <List.Item>For any sweatshirt (all sweatshirt styles): $9/sweatshirt</List.Item>
                    </List.List>
                  </List.Item>
                  <List.Item>
                    <strong>International Shipping</strong>:
                    <List.List>
                      <List.Item>For any shirt (T-shirt or sweatshirt): $28/shirt</List.Item>
                    </List.List>
                  </List.Item>
                </List>
              </Grid.Column>
              <Grid.Column width={5}>
                <Image src={`${s3_prefix}shirt_design_background.png`} />
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <Header size="medium">Shirts</Header>
          <div className="gear-container">
            {this.getImageCard("ctm")}
            {this.getImageCard("ctw")}
            {this.getImageCard("cty")}
            {this.getImageCard("btm")}
            {this.getImageCard("btw")}
            {this.getImageCard("bvtw")}
            {this.getImageCard("lstm")}
            {this.getImageCard("lstw")}
          </div>
          <Header size="medium">Outerwear</Header>
          <div className="gear-container">
            {this.getImageCard("csu")}
            {this.getImageCard("hu")}
            {this.getImageCard("hy")}
            {this.getImageCard("huz")}
            {this.getImageCard("qzu")}
          </div>
        </Segment>
      </Container>
    )
  }

}
