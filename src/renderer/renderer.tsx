import * as React from "react";
import * as ReactDOM from "react-dom";
import SignIn from "./pages/signin";

function App() {
  return <SignIn />;
}

ReactDOM.render(<App />, document.querySelector("#app"));
