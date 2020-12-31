import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';

import { Container, Segment, Header, Button, Modal } from 'semantic-ui-react';

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
    details.style.display = "block";

    details.style.top = window.innerHeight / 2 - $("#gearDetails").innerHeight() / 2 + "px";
    details.style.left = window.innerWidth / 2 - $("#gearDetails").innerWidth() / 2 + "px";
  }

  closeDetails(e) {
    details = document.getElementById("gearDetails");
    details.style.display = "none";
  }

  componentDidMount() {
    window.addEventListener("resize", this.updateDimensions.bind(this));
  }

  isTall() {
    return window.innerWidth < window.innerHeight - 200;
  }

  updateDimensions() {
    this.forceUpdate();
    details = document.getElementById("gearDetails");
    if (details.style.display == "block") {
      details.style.top = window.innerHeight / 2 - $("#gearDetails").innerHeight() / 2 + "px";
      details.style.left = window.innerWidth / 2 - $("#gearDetails").innerWidth() / 2 + "px";
      document.getElementById("flexBox").style.flexDirection = this.isTall() ? "column" : "row";
      details.style.display = "block";
      details.style.width = "auto";
      details.style.height = "auto";
      closeButton = document.getElementById("close");
      closeButton.style.top = details.style.top;
      closeButton.style.left = details.style.left;
    }
  }

  getImageCard(name, code) {
    path = "/img/gear/" + code + "f.jpg";
    return (
      <div className="gearitem ui card" style={{width: "30%", display: "inline-block", marginLeft: "20px"}}>
        <img style={{maxHeight: "100%", maxWidth: "100%", verticalAlign: "bottom"}} onClick={this.gearDetails} src={path}></img>
        <div className="content" style={{height: "75px"}}>
          <span> {name} </span>
        </div>
      </div>
    );
  }

  render() {
    let direction = this.isTall() ? "column" : "row";
    let flexBoxHeight = window.innerHeight - 200 - 40 + "px";

    return (
      <Container className="section">
        <div id="gearDetails" style={{padding: "20px", zIndex: "1000", position: "fixed", left: 0, top: 0, display: "none", maxWidth: window.innerWidth - 100, backgroundColor: "white", borderRadius: "5px", boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.25)"}}>
            <i id="close" className="close icon" onClick={this.closeDetails}></i>
            <div id="flexBox" style={{display: "flex", flexDirection: direction, height: flexBoxHeight}}>
              <div style={{display: "inline-block", minWidth: 0, minHeight: 0, maxHeight: "100%", flexBasis: 0, flexGrow: 1}}>
                <div className="ui slide instant masked reveal image">
                  <img className="visible content" src="/img/gear/btmf.jpg" style={{maxWidth: "100%", maxHeight: "100%"}} />
                  <img className="hidden content" src="/img/gear/btmb.jpg" style={{maxWidth: "100%", maxHeight: "100%"}} />
                </div>
                <br />
                <p>Hover on image to see back.</p>
              </div>
              <div style={{paddingLeft: "10px", verticalAlign: "top", display:"inline-block", minWidth: 0, minHeight: 0, flexBasis: 0, flexGrow: 1}}>
                <Header as="h2">Available Colors:</Header>
                <img style={{verticalAlign: "top", maxWidth: "100%"}} className="swatches" src="/img/gear/men_blend_t.jpg"></img>
              </div>
            </div>
        </div>
        <Segment basic>
          <PuzzlePageTitle title="Gear" />
          <Header size="medium">Shirts</Header>
          { this.getImageCard("Men's Cotton/Poly Blend Tee", "btm") }
          { this.getImageCard("Women's Cotton/Poly Blend Tee", "btw") }
          { this.getImageCard("Men's Cotton Tee", "ctm") }
          { this.getImageCard("Women's Cotton Tee", "ctw") }
          { this.getImageCard("Men's Long Sleeve Cotton Tee", "lstm") }
          { this.getImageCard("Women's Long Sleeve Cotton Tee", "lstw") }
          { this.getImageCard("Youth Cotton Tee", "cty") }

          <Header size="medium">Outerwear</Header>

          { this.getImageCard("Unisex Crew Sweatshirt", "fcu") }
          { this.getImageCard("Unisex Hoodie Sweatshirt", "hu") }
          { this.getImageCard("Youth Hoodie", "hy") }
          { this.getImageCard("Unisex Quarter-zip Collar Sweatshirt", "qzu") }

        </Segment>
      </Container>
    )
  }

}
