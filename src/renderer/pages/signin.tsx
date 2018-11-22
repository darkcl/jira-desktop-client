import * as React from "react";
import { JIRALoginForm, Papper, LoadingIndicator } from "../components";

import { ipcRenderer } from "electron";

interface SignInProps {}

interface SignInState {
  email: string;
  password: string;
  host: string;
}

export class SignInPage extends React.Component<SignInProps, SignInState> {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      host: ""
    };
  }

  private backgroudStyle: React.CSSProperties = {
    backgroundColor: "#4286f4",
    width: "100vw",
    height: "100vh"
  };

  handleChange(event) {
    if (event.target.id === "host") {
    } else if (event.target.id === "email") {
      this.setState({ email: event.target.value });
    } else if (event.target.id === "password") {
      this.setState({ password: event.target.value });
    }
  }

  render() {
    return (
      <div style={this.backgroudStyle}>
        <Papper>
          <JIRALoginForm
            host={this.state.host}
            email={this.state.email}
            password={this.state.password}
            onEmailChanged={email => {
              this.setState({ email });
            }}
            onHostChanged={host => {
              this.setState({ host });
            }}
            onPasswordChanged={password => {
              this.setState({ password });
            }}
            onSubmit={this.handleSubmit}
          />
        </Papper>
      </div>
    );
  }

  handleSubmit(): void {
    console.log(this.state);
    // ipcRenderer.sendSync("save-auth", this.state);
  }
}
