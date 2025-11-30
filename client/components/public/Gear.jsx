import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';

import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { Container, Segment, Header, Icon, Modal, Grid, List, Card, Image } from 'semantic-ui-react';
import LinkButton from '../imports/LinkButton';

const { eventYear, gearSaleEnd, registrationOpenDate } = Meteor.settings.public;

const link = `https://commerce.cashnet.com/TheGreatPuzzleHunt${eventYear}`;

const s3_prefix = `https://gph-distributed.s3.us-west-2.amazonaws.com/${eventYear}/gear/`;

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
	"ctm": [
		'Aquatic', 'Ash', 'Azalea', 'Black', 'Carolina Blue', 'Cornsilk', 'Gravel', 'Heliconia', 'Ice Grey',
		'Light Blue', 'Light Pink', 'Mint Green', 'Natural', 'Safety Green', 'Safety Pink', 'Sport Grey',
		'Violet', 'White', 'Yellow Haze'
	],
	"ctw": [
		'Ash', 'Athletic Heather', 'Candy Pink', 'Jet Black', 'Light Blue', 'White'
	],
	"cty": [
		'Aquatic', 'Ash', 'Black', 'Carolina Blue', 'Light Blue', 'Light Pink', 'Mint Green', 'Natural',
		'Safety Green', 'Safety Pink', 'Sport Grey', 'White', 'Yellow Haze'
	],
	"btm": [
		'Aqua Heather', 'Awareness Pink Heather', 'Black', 'Carnation Pink', 'Electric Purple Heather',
		'Flint Blue Heather', 'Heathered Dusty Sage', 'Light Heather Grey', 'Safety Green', 'White'
	],
	"btw": [
		'Aqua Heather', 'Black', 'Light Heather Grey', 'White'
	],
	"bvtw": [
		'Black', 'Blush Frost', 'Grey Frost', 'Heathered Lavender', 'Heathered Royal', 'White'
	],
	"lstm": [
		'Ash', 'Black', 'Carolina Blue', 'Indigo blue', 'Light Blue', 'Light Pink', 'Natural', 'Safety Green',
		'Sport Grey', 'White'
	],
	"lstw": [
		'Aquatic Blue', 'Athletic Heather', 'Candy Pink', 'Jet Black', 'White'
	],
	"csu": [
		'Ash', 'Black', 'Carolina Blue', 'Light Blue', 'Light Pink', 'Safety Green', 'Safety Pink', 'Sand',
		'Sport Grey', 'White'
	],
	"hu": [
		'Ash', 'Black', 'Carolina Blue', 'Heliconia', 'Light Blue', 'Light Pink', 'Mint Green', 'Old Gold',
		'Orchid', 'Safety Green', 'Safety Pink', 'Sand', 'Sport Grey', 'Violet', 'White'
	],
	"hy": [
		'Ash', 'Black', 'Carolina Blue', 'Gold', 'Heliconia', 'Light Pink', 'Sport Grey', 'White'
	],
	"huz": [
		'Ash', 'Black', 'Carolina Blue', 'Safety Green', 'Sport Grey', 'White'
	],
	"qzu": [
		'Ash', 'Black', 'Oxford', 'White'
	]
};

const cardColors = {
    "ctm": 'Safety Green',
    "ctw": 'Light Blue',
    "cty": 'Safety Pink',
    "btm": 'Electric Purple Heather',
    "btw": 'Aqua Heather',
    "bvtw": 'Grey Frost',
    "lstm": 'Indigo Blue',
    "lstw": 'White',
    "csu": 'Black',
    "hu": 'Mint Green',
    "hy": 'Gold',
    "huz": 'Carolina Blue',
    "qzu": 'Ash'
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

    getImageURL(code, color, prefix="", suffix="") {
		return `${s3_prefix}${prefix}${code}_${color.toLowerCase().replaceAll(" ", "-")}${suffix}.webp`;
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

	let mainColor = "";
	if (this.state.code)
	    mainColor = cardColors[this.state.code.toLowerCase()];
	
	return (
	    <Container className="section">
		<Modal closeIcon open={this.state.open} onClose={this.onClose}>
		    <Modal.Content>
			<Grid stackable columns={2} style={{ flexWrap: "wrap" }}>

			    <Grid.Column width={8}>
				<Slider {...settings}>
				    <img src={this.getImageURL(this.state.code, mainColor, "main_images/", "_front")} />
				    <img src={this.getImageURL(this.state.code, mainColor, "main_images/", "_back")} />
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
				<LinkButton as='a' href={link}
					    size="huge" color="orange" target="_blank"
					    icon={<Icon name="shopping cart" />}
					    content="Buy"
				/>
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
			<Grid stackable>
				<Grid.Column width={7}>
				<Header as="h2">PLEASE NOTE:</Header>
				SHIRTS ARRIVE <b>AFTER</b> EVENT and are <b>NOT</b> AVAILABLE FOR PICKUP AT EVENT.
				<br /><br />
				Gear store opens {registrationOpenDate}.
				<br />
				Gear store closes {gearSaleEnd} at midnight.
				<br />
				Shirts will be ordered on Monday, April 20, 2025, and assuming no supply chain delays, should be shipped out or ready for pick-up the week of May 4, 2026.
				<br /><br />
				Prices on varying styles range from $20&ndash;$40, additional charges for extended sizes.
				<br /><br />
				Click on each item for more information.
				<br /><br />

		    
			{/* <Grid.Row> */}
			    
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
			{/* </Grid.Row> */}
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
