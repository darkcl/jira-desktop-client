import * as React from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import LockIcon from "@material-ui/icons/LockOutlined";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import withStyles from "@material-ui/core/styles/withStyles";
import { createStyles, Theme } from "@material-ui/core";

import { ipcRenderer, remote } from "electron";

const app = remote.app;
const BrowserWindow = remote.BrowserWindow;
const dialog = remote.dialog;

const styles = (theme: Theme) =>
  createStyles({
    main: {
      userSelect: "none",
      width: "auto",
      display: "block", // Fix IE 11 issue.
      marginLeft: theme.spacing.unit * 3,
      marginRight: theme.spacing.unit * 3,
      [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
        width: 400,
        marginLeft: "auto",
        marginRight: "auto"
      }
    },
    paper: {
      marginTop: theme.spacing.unit * 8,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme
        .spacing.unit * 3}px`
    },
    avatar: {
      margin: theme.spacing.unit,
      backgroundColor: theme.palette.secondary.main
    },
    form: {
      width: "100%", // Fix IE 11 issue.
      marginTop: theme.spacing.unit
    },
    submit: {
      marginTop: theme.spacing.unit * 3
    }
  });

export interface SignInProps {
  classes: any;
}

export interface SignInState {
  email: string;
  password: string;
  host: string;
}

class SignIn extends React.Component<SignInProps, SignInState> {
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
    const { classes } = this.props;
    return (
      <main className={classes.main}>
        <CssBaseline />
        <Paper className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form className={classes.form}>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="email">JIRA Host</InputLabel>
              <Input
                id="host"
                name="host"
                value={this.state.host}
                autoFocus
                onChange={event => this.handleChange(event)}
              />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="email">Email Address</InputLabel>
              <Input
                id="email"
                name="email"
                autoComplete="email"
                value={this.state.email}
                onChange={event => this.handleChange(event)}
              />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="password">Password</InputLabel>
              <Input
                name="password"
                type="password"
                id="password"
                value={this.state.password}
                autoComplete="current-password"
                onChange={event => this.handleChange(event)}
              />
            </FormControl>
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={event => this.handleSubmit(event)}
            >
              Sign in
            </Button>
          </form>
        </Paper>
      </main>
    );
  }

  handleSubmit(event): void {
    console.log(this.state);
    ipcRenderer.sendSync("save-auth", this.state);
  }
}

export default withStyles(styles)(SignIn);
