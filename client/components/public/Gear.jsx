import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';

import { Container, Segment, Header, Button} from 'semantic-ui-react';

Gear = class Gear extends Component {

  gearDetails(e) {
    details = document.getElementById("gearDetails");
    details.style.top = "calc(50% - " + $("#gearDetails").innerHeight() / 2 + "px)";
    details.style.left = "calc(50% - " + $("#gearDetails").innerWidth() / 2 + "px)";
    details.style.display = "block";

  }

  closeDetails(e) {
    details = document.getElementById("gearDetails");
    details.style.display = "none";
    console.log("hello?");
  }

  render() {
    return (
      <Container className="section">
        <div id="gearDetails" style={{zIndex: "1000", position: "fixed", display: "none"}}>
          <div style={{backgroundColor: "white", borderRadius: "5px", boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.25)"}}>
            <i className="close icon" onClick={this.closeDetails}></i>
            <Segment basic>
              <img className="picture" src="/img/gear/btmf.png" style={{display: "inline-block", maxHeight: window.innerHeight - 300}}></img>
              <div style={{verticalAlign: "top", display:"inline-block"}}>
                <Header as="h1">Available Colors:</Header>
                <img style={{maxWidth: window.innerWidth - 100, verticalAlign: "top"}} className="swatches" src="/img/gear/men_blend_t.png"></img>
              </div>
              
            </Segment>
          </div>
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
