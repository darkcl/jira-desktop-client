import * as React from "react";
import { TextField, PrimaryButton, Dialog } from "office-ui-fabric-react";

interface JIRALoginFormProps {
  host: string;
  email: string;
  password: string;
  onHostChanged: (host: string) => void;
  onEmailChanged: (email: string) => void;
  onPasswordChanged: (password: string) => void;
  onSubmit: () => void;
}

export class JIRALoginForm extends React.Component<JIRALoginFormProps, {}> {
  private formStyle: React.CSSProperties = {
    marginBottom: "16px"
  };

  private containerStyle: React.CSSProperties = {
    width: "320px",
    height: "300px",
    position: "absolute",
    margin: "auto",
    top: "0",
    right: "0",
    bottom: "0",
    left: "0",
    backgroundColor: "white"
  };

  render() {
    return (
      <div className="ms-Grid" dir="ltr" style={this.containerStyle}>
        <div className="ms-Grid-row" style={this.formStyle}>
          <TextField
            id="host"
            value={this.props.host}
            placeholder="JIRA Host"
            prefix="https://"
            underlined
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              this.props.onHostChanged(event.target.value)
            }
          />
        </div>
        <div className="ms-Grid-row" style={this.formStyle}>
          <TextField
            id="email"
            value={this.props.email}
            placeholder="Email"
            underlined
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              this.props.onEmailChanged(event.target.value)
            }
          />
        </div>
        <div className="ms-Grid-row" style={this.formStyle}>
          <TextField
            id="password"
            value={this.props.password}
            placeholder="Password"
            type="password"
            underlined
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              this.props.onPasswordChanged(event.target.value)
            }
          />
        </div>
        <div className="ms-Grid-row">
          <PrimaryButton
            text="Login"
            onClick={event => this.props.onSubmit()}
            allowDisabledFocus={true}
          />
        </div>
      </div>
    );
  }
}
