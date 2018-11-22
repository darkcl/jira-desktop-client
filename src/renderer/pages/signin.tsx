import * as React from "react";
import { JIRALoginForm, Papper, LoadingIndicator } from "../components";

import { ipcRenderer } from "electron";

interface SignInProps {}

interface SignInState {
  email: string;
  password: string;
  host: string;
  isLoading: boolean;
  isLogin: boolean;
}

export class SignInPage extends React.Component<SignInProps, SignInState> {
  constructor(props) {
    super(props);
    this.state = {
      isLogin: false,
      isLoading: false,
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

  componentDidMount() {
    ipcRenderer.on("response-save-auth", (event, payload) => {
      const { error, session } = payload;
      this.setState({ isLoading: false });
      if (error !== undefined) {
        console.log(error);
      } else {
        this.setState({ isLogin: true });
      }
    });
  }

  render() {
    return (
      <div style={this.backgroudStyle}>
        <Papper>
          {this.state.isLoading ? (
            <LoadingIndicator />
          ) : (
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
              onSubmit={() => this.handleSubmit()}
            />
          )}
        </Papper>
      </div>
    );
  }

  handleSubmit(): void {
    this.setState({ isLoading: true });
    ipcRenderer.send("save-auth", this.state);
  }
}
