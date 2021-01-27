import React from "react";
import PropTypes from "prop-types";
import { Styled } from "direflow-component";
import { MuiThemeProvider } from "@material-ui/core/styles";
import styles from "./App.css";
import theme from "./config/theme";
import AbmTabs from "./components/AbmTabs";

const App = (props) => {
  return (
    <Styled styles={styles}>
      <MuiThemeProvider theme={theme}>
        <AbmTabs {...props}></AbmTabs>
      </MuiThemeProvider>
    </Styled>
  );
};

App.defaultProps = {
  patents: [],
  transportists: [],
  terminals: [],
};

App.propTypes = {
  patents: PropTypes.array,
  transportists: PropTypes.array,
  terminals: PropTypes.array,
};

export default App;
