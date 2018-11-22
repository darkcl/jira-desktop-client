import * as React from "react";
import * as ReactDOM from "react-dom";

import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";
import { initializeIcons } from "@uifabric/icons";
initializeIcons();

import { ThemeProvider } from "./theme";

import { BoardPage, SignInPage } from "./pages";
import ThemeInterface from "./theme/theme";
import { fillScreen } from "./style";
import { LoadingIndicator } from "./components";

import { ipcRenderer } from "electron";

interface AppState {
  isLogin: boolean;
  isLoading: boolean;
}

class App extends React.Component<{}, AppState> {
  constructor(props) {
    super(props);
    this.state = {
      isLogin: false,
      isLoading: true
    };
  }

  componentDidMount() {
    ipcRenderer.send("request-saved-token");
    ipcRenderer.on("response-saved-token", (event, payload) => {
      this.setState({ isLoading: false, isLogin: payload.hasToken });
    });
  }

  render() {
    return (
      <div style={fillScreen}>
        {this.state.isLoading ? (
          <LoadingIndicator />
        ) : this.state.isLogin ? (
          <BoardPage />
        ) : (
          <SignInPage />
        )}
      </div>
    );
  }
}

const theme: ThemeInterface = {
  primaryColor: "red",
  primaryColorInverted: "green"
};

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>,
  document.querySelector("#app")
);
