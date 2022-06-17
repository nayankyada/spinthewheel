import React from "react";
import ReactDOM from "react-dom";
import { Location } from "./location";
import "./styles.css";

class App extends React.Component {
  state = {
    list: [
      "Nayan1",
      "Nayan2",
      "Nayan3",
      "Nayan4",
      "Nayan5",
      "Nayan6",
      "Nayan7",
      "Nayan8",
      "Nayan9",
      "Nayan10",
      "Nayan11",
      "Nayan12"
    ],
    // list: ["$100", "$500", "$9,999", "$1", "$60", "$1,000", "$4.44"],
    // list: ["$100", "$500", "$9,999", "$1", "$60"],
    radius: 65, // PIXELS
    rotate: 0, // DEGREES
    easeOut: 0, // SECONDS
    angle: 0, // RADIANS
    top: null, // INDEX
    offset: 180, // RADIANS
    net: null, // RADIANS
    result: null, // INDEX
    spinning: false
  };

  componentDidMount() {
    // generate canvas wheel on load
    this.renderWheel();
  }

  renderWheel() {
    // determine number/size of sectors that need to created
    let numOptions = this.state.list.length;
    let arcSize = (2 * Math.PI) / numOptions;
    this.setState({
      angle: arcSize
    });

    // get index of starting position of selector
    this.topPosition(numOptions, arcSize);

    // dynamically generate sectors from state list
    let angle = 0;
    for (let i = 0; i < numOptions; i++) {
      let text = this.state.list[i];
      this.renderSector(i + 1, text, angle, arcSize, this.getColor(i));
      angle += arcSize;
    }

    this.renderCircle();
    this.renderCenterCircle();
  }

  topPosition = (num, angle) => {
    // set starting index and angle offset based on list length
    // works upto 9 options
    let topSpot = null;
    let degreesOff = null;
    if (num === 9) {
      topSpot = 7;
      degreesOff = Math.PI / 2 - angle * 2;
    } else if (num === 8) {
      topSpot = 6;
      degreesOff = 0;
    } else if (num <= 7 && num > 4) {
      topSpot = num - 1;
      degreesOff = Math.PI / 2 - angle;
    } else if (num === 4) {
      topSpot = num - 1;
      degreesOff = 0;
    } else if (num <= 3) {
      topSpot = num;
      degreesOff = Math.PI / 2;
    }

    this.setState({
      top: topSpot - 1,
      offset: degreesOff
    });
  };
  renderCenterCircle(index, text, start, arc, color) {
    var c = document.getElementById("wheel");
    var ctx = c.getContext("2d");
    ctx.beginPath();
    ctx.arc(150, 150, 10, 0, 2 * Math.PI);
    ctx.lineWidth = 20;
    ctx.strokeStyle = "white";
    ctx.shadowBlur = 5;
    ctx.shadowColor = "gray";
    ctx.stroke();
  }
  renderCircle() {
    var c = document.getElementById("wheel");
    var ctx = c.getContext("2d");
    ctx.beginPath();
    ctx.arc(150, 150, this.state.radius * 2, 0, 2 * Math.PI);
    ctx.lineWidth = 5;
    ctx.strokeStyle = "white";
    ctx.shadowBlur = 5;
    ctx.shadowColor = "#A9A9A9";
    ctx.strokeStyle = "white";

    ctx.stroke();
  }
  renderSector(index, text, start, arc, color) {
    // create canvas arc for each list element
    let canvas = document.getElementById("wheel");
    let ctx = canvas.getContext("2d");
    let x = canvas.width / 2;
    let y = canvas.height / 2;
    let radius = this.state.radius;
    let startAngle = start;
    let endAngle = start + arc;
    let angle = index * arc;
    let baseSize = radius * 2.33;
    let textRadius = baseSize - 65;

    ctx.beginPath();
    ctx.arc(x, y, radius, startAngle, endAngle, false);
    ctx.lineWidth = radius * 2;
    ctx.strokeStyle = color;

    ctx.font = "500 12px Arial";
    ctx.fillStyle = index % 2 === 0 ? "white" : "black";
    ctx.shadowBlur = 1;
    ctx.shadowColor = index % 2 === 0 ? "white" : "black";
    ctx.stroke();

    ctx.save();
    ctx.translate(
      baseSize + Math.cos(angle - arc / 2.5) * textRadius,
      baseSize + Math.sin(angle - arc / 2) * textRadius
    );
    ctx.rotate(angle - arc / 1.9);
    ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
    ctx.restore();
  }

  getColor(i) {
    // randomly generate rbg values for wheel sectors

    return i % 2 === 0 ? `#f9cacd` : "#ab5252";
  }

  spin = () => {
    // set random spin degree and ease out time
    // set state variables to initiate animation
    let randomSpin = Math.floor(Math.random() * 900) + 500 + this.state.rotate;
    console.log(randomSpin);
    this.setState({
      rotate: randomSpin,
      easeOut: 2,
      spinning: true
    });

    // calcalute result after wheel stops spinning
    setTimeout(() => {
      this.getResult(randomSpin);
    }, 2000);
  };

  getResult = (spin) => {
    // find net rotation and add to offset angle
    // repeat substraction of inner angle amount from total distance traversed
    // use count as an index to find value of result from state list
    const { angle, top, offset, list } = this.state;
    let netRotation = ((spin % 360) * Math.PI) / 180; // RADIANS
    let travel = netRotation + offset;
    // console.log("travel", travel);
    let count = top + 1;
    while (travel > 0) {
      travel = travel - angle;
      // console.log("travel", travel);
      count--;
      // console.log("count", count);
    }
    let result;
    if (count >= 0) {
      result = count;
    } else {
      result = list.length + count;
    }
    // console.log("result", result);

    // set state variable to display result
    this.setState({
      net: netRotation,
      result: result
    });
  };

  reset = () => {
    // reset wheel and result
    this.setState({
      rotate: 0,
      easeOut: 0,
      result: null,
      spinning: false
    });
  };

  render() {
    return (
      <div className="App">
        <span id="selector">
          <Location />
        </span>
        <canvas
          id="wheel"
          width="300"
          height="300"
          style={{
            WebkitTransform: `rotate(${this.state.rotate}deg)`,
            WebkitTransition: `-webkit-transform ${this.state.easeOut}s ease-out`
          }}
        />

        {/* {this.state.spinning ? (
          <button type="button" id="reset" onClick={this.reset}>
            reset
          </button>
        ) : ( */}
        <button type="button" id="spin" onClick={this.spin}>
          spin
        </button>
        {/* )} */}
        <div class="display">
          <span id="readout">
            <span id="result">{this.state.list[this.state.result]}</span>
          </span>
        </div>
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
