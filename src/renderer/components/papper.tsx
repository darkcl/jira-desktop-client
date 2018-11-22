import * as React from "react";
import { centerStyle } from "../style";

export class Papper extends React.Component {
  private containerStyle: React.CSSProperties = {
    width: "450px",
    height: "500px",
    backgroundColor: "white",
    ...centerStyle
  };

  render() {
    return <div style={this.containerStyle}>{this.props.children}</div>;
  }
}
