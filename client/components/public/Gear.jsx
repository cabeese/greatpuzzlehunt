import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';

import { Container, Segment, Header, Button, Modal } from 'semantic-ui-react';

Gear = class Gear extends Component {

  gearDetails(e) {
    str = e.target.src;
    str = str.split("").reverse().join("");
    str = str.substring(5, str.indexOf('/'));
    str = str.split("").reverse().join("");
    console.log(str);
    details = document.getElementById("gearDetails");
    
    image = details.getElementsByTagName("img")[0];
    swatches = details.getElementsByTagName("img")[1];
    image.src = "/img/gear/" + str + "f.png";
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
    return window.innerWidth < window.innerHeight;
  }

  updateDimensions() {
    console.log("poop");
    this.forceUpdate();
    details = document.getElementById("gearDetails");
    details.style.top = window.innerHeight / 2 - $("#gearDetails").innerHeight() / 2 + "px";
    details.style.left = window.innerWidth / 2 - $("#gearDetails").innerWidth() / 2 + "px";
    details.style.display = "block";
    details.style.width = "auto";
    details.style.height = "auto";
    closeButton = document.getElementById("close");
    closeButton.style.top = details.style.top;
    closeButton.style.left = details.style.left;
    document.getElementById("flexBox").style.flexDirection = this.isTall() ? "column" : "row";
  }

  render() {
    let direction = this.isTall() ? "column" : "row";
    return (
      <Container className="section">
        <div id="gearDetails" style={{padding: "20px", zIndex: "1000", position: "fixed", left: 0, top: 0, display: "none", maxHeight: window.innerHeight - 200, maxWidth: window.innerWidth - 100, backgroundColor: "white", borderRadius: "5px", boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.25)"}}>
            <i id="close" style={{position: "fixed"}} className="close icon" onClick={this.closeDetails}></i>
            {/* <Segment basic> */}
            <div id="flexBox" style={{display: "flex", flexDirection: direction}}>
              <div style={{display: "inline-block", minWidth: 0, maxHeight: "100%", flexBasis: 0, flexGrow: 1}}>
                <img className="picture" src="/img/gear/btmf.png" style={{display: "inline-block", minWidth: 0, maxHeight: "100%", flexBasis: 0, flexGrow: 1}}></img>
              </div>
              <div style={{verticalAlign: "top", display:"inline-block", minWidth: 0, flexBasis: 0, flexGrow: 1}}>
                <Header as="h2">Available Colors:</Header>
                <img style={{verticalAlign: "top", maxWidth: "100%"}} className="swatches" src="/img/gear/men_blend_t.png"></img>
              </div>
            </div>
            {/* </Segment> */}
        </div>
        <Segment basic>
          <PuzzlePageTitle title="Gear" />
          <Header size="medium">Shirts</Header>
          <div className="gearitem ui card" style={{width: "40%", display: "inline-block", marginLeft: "20px"}}>
            <div onClick={this.gearDetails} className="ui image">
              <img className="content" src="/img/gear/btmf.png"></img>
              {/* <img className="hidden content" src="/img/gear/btmf.png"></img> */}
            </div>
            <div className="content">
              <div style={{verticalAlign: "top", width: "75%", textAlign: "left", display: "inline-block"}}>Men's Cotton/Poly Blend Tee</div>
              <div style={{verticalAlign: "top", width: "25%", textAlign: "right", display: "inline-block"}}>$555</div>
            </div>
          </div>

          <div className="gearitem ui card" style={{width: "40%", display: "inline-block", marginLeft: "20px"}}>
            <div onClick={this.gearDetails} className="ui image">
              <img className="content" src="/img/gear/btwf.png"></img>
              {/* <img className="hidden content" src="/img/gear/btwf.png"></img> */}
            </div>
            <div className="content">
              <div style={{verticalAlign: "top", width: "75%", textAlign: "left", display: "inline-block"}}>Women's Cotton/Poly Blend Tee</div>
              <div style={{verticalAlign: "top", width: "25%", textAlign: "right", display: "inline-block"}}>$555</div>
            </div>
          </div>

          <div className="gearitem ui card" style={{width: "40%", display: "inline-block", marginLeft: "20px"}}>
            <div onClick={this.gearDetails} className="ui image">
              {/* <img className="visible content" src="/img/gear/ctmf.png"></img> */}
              <img className="content" src="/img/gear/ctmb.png"></img>
            </div>
            <div className="content">
              <div style={{verticalAlign: "top", width: "75%", textAlign: "left", display: "inline-block"}}>Men's Cotton Tee</div>
              <div style={{verticalAlign: "top", width: "25%", textAlign: "right", display: "inline-block"}}>$555</div>
              <br />&nbsp;
            </div>
          </div>

          <div className="gearitem ui card" style={{width: "40%", display: "inline-block", marginLeft: "20px"}}>
            <div onClick={this.gearDetails} className="ui slide masked reveal image">
              <img className="visible content" src="/img/gear/ctwf.png"></img>
              <img className="hidden content" src="/img/gear/ctwb.png"></img>
            </div>
            <div className="content">
              <div style={{verticalAlign: "top", width: "75%", textAlign: "left", display: "inline-block"}}>Women's Cotton Tee</div>
              <div style={{verticalAlign: "top", width: "25%", textAlign: "right", display: "inline-block"}}>$555</div>
              <br />&nbsp;
            </div>
          </div>

          <div className="gearitem ui card" style={{width: "40%", display: "inline-block", marginLeft: "20px"}}>
            <div onClick={this.gearDetails} className="ui image">
              {/* <img className="visible content" src="/img/gear/lstmf.png"></img> */}
              <img className="content" src="/img/gear/lstmb.png"></img>
            </div>
            <div className="content">
              <div style={{verticalAlign: "top", width: "75%", textAlign: "left", display: "inline-block"}}>Men's Long Sleeve Cotton Tee</div>
              <div style={{verticalAlign: "top", width: "25%", textAlign: "right", display: "inline-block"}}>$555</div>
            </div>
          </div>

          <div className="gearitem ui card" style={{width: "40%", display: "inline-block", marginLeft: "20px"}}>
            <div onClick={this.gearDetails} className="ui slide masked reveal image">
              <img className="visible content" src="/img/gear/lstwf.png"></img>
              <img className="hidden content" src="/img/gear/lstwb.png"></img>
            </div>
            <div className="content">
              <div style={{verticalAlign: "top", width: "75%", textAlign: "left", display: "inline-block"}}>Women's Long Sleeve Cotton Tee</div>
              <div style={{verticalAlign: "top", width: "25%", textAlign: "right", display: "inline-block"}}>$555</div>
            </div>
          </div>

          <div className="gearitem ui card" style={{width: "40%", display: "inline-block", marginLeft: "20px"}}>
            <div onClick={this.gearDetails} className="ui image">
              {/* <img className="visible content" src="/img/gear/ctyf.png"></img> */}
              <img className="content" src="/img/gear/ctyb.png"></img>
            </div>
            <div className="content">
              <div style={{verticalAlign: "top", width: "75%", textAlign: "left", display: "inline-block"}}>Youth Cotton Tee</div>
              <div style={{verticalAlign: "top", width: "25%", textAlign: "right", display: "inline-block"}}>$555</div>
              <br />&nbsp;
            </div>
          </div>

          <Header size="medium">Outerwear</Header>

        </Segment>
      </Container>
    )
  }

}
