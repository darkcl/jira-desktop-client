import * as React from "react";
import * as ReactDOM from "react-dom";

import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import { SignInPage } from "./pages";

const About = () => <h2>About</h2>;
const Users = () => <h2>Users</h2>;

function AppRouter() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about/">About</Link>
            </li>
            <li>
              <Link to="/users/">Users</Link>
            </li>
          </ul>
        </nav>

        <Route path="/" exact component={SignInPage} />
        <Route path="/about/" component={About} />
        <Route path="/users/" component={Users} />
      </div>
    </Router>
  );
}

ReactDOM.render(<SignInPage />, document.querySelector("#app"));
