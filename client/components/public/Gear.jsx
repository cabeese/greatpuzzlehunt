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
                <Header as="h2"></Header>
                <Header as="h2">Colors:</Header>
                <img style={{verticalAlign: "top", maxWidth: "100%"}} className="swatches" src="/img/gear/men_blend_t.png"></img>
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
