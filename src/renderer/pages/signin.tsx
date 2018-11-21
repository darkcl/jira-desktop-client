import * as React from "react";
import { TextField, PrimaryButton } from "office-ui-fabric-react";

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

  handleChange(event) {
    if (event.target.id === "host") {
      this.setState({ host: event.target.value });
    } else if (event.target.id === "email") {
      this.setState({ email: event.target.value });
    } else if (event.target.id === "password") {
      this.setState({ password: event.target.value });
    }
  }

  render() {
    return (
      <div className="docs-TextFieldExample">
        <TextField
          id="host"
          value={this.state.host}
          label="JIRA Host"
          required={true}
          onChange={event => this.handleChange(event)}
        />
        <TextField
          id="email"
          value={this.state.email}
          label="Email"
          required={true}
          onChange={event => this.handleChange(event)}
        />
        <TextField
          id="password"
          value={this.state.password}
          label="Password"
          required={true}
          type="password"
          onChange={event => this.handleChange(event)}
        />
        <PrimaryButton
          text="Login"
          onClick={event => this.handleSubmit(event)}
          allowDisabledFocus={true}
        />
      </div>
    );
  }

  handleSubmit(event): void {
    console.log(this.state);
    ipcRenderer.sendSync("save-auth", this.state);
  }
}
