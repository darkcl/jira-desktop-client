import * as React from "react";
import { Spinner, SpinnerSize } from "office-ui-fabric-react";
import { fillContainer } from "../style";

export class LoadingIndicator extends React.Component {
  private containerStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "auto",
    ...fillContainer
  };

  private spinnerStyle: React.CSSProperties = {};

  render() {
    return (
      <div style={this.containerStyle}>
        <Spinner
          style={this.spinnerStyle}
          size={SpinnerSize.large}
          label="Seriously, it is still loading..."
          ariaLive="assertive"
        />
      </div>
    );
  }
}
