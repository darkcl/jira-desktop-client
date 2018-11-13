import React from "react";
import ReactDOM from "react-dom";
import Button from "@material-ui/core/Button";
import SignIn from "./pages/signin";

function App() {
  return <SignIn />;
}

ReactDOM.render(<App />, document.querySelector("#app"));
