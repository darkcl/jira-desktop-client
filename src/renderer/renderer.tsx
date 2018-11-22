import * as React from "react";
import * as ReactDOM from "react-dom";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { initializeIcons } from "@uifabric/icons";
initializeIcons();

import { ThemeProvider } from "./theme";

import { BoardPage, SignInPage } from "./pages";
import ThemeInterface from "./theme/theme";

function AppRouter() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={SignInPage} />
        <Route path="/board" component={BoardPage} />
      </Switch>
    </Router>
  );
}

const theme: ThemeInterface = {
  primaryColor: "red",
  primaryColorInverted: "green"
};

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <AppRouter />
  </ThemeProvider>,
  document.querySelector("#app")
);
