import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import PropTypes from "prop-types";
import Box from "@material-ui/core/Box";
import Create from "./Create";
import Delete from "./Delete";
import Logs from "./Logs";

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

const AntTabs = withStyles({
  root: {
    borderBottom: "1px solid #e8e8e8",
  },
  indicator: {
    backgroundColor: "#1890ff",
  },
})(Tabs);

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const AntTab = withStyles((theme) => ({
  root: {
    textTransform: "none",
    minWidth: 72,
    fontWeight: theme.typography.fontWeightRegular,
    marginRight: theme.spacing(4),
    fontFamily: "Roboto",
    "&:hover": {
      color: "#40a9ff",
      opacity: 1,
    },
    "&$selected": {
      color: "#2A2F9A",
      fontWeight: theme.typography.fontWeightMedium,
    },
    "&:focus": {
      color: "#2A2F9A",
    },
  },
  selected: {},
}))((props) => <Tab disableRipple {...props} />);

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: 1080,
    height: 520,
  },
  padding: {
    padding: theme.spacing(3),
  },
  demo1: {
    backgroundColor: theme.palette.background.paper,
  },
  demo2: {
    backgroundColor: "#2e1534",
  },
}));

export default function AbmTabs(props) {
  const { patents, transportists, terminals } = props;
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const [logData, setLogData] = React.useState([]);

  const handleChange = async (event, newValue) => {
    setValue(newValue);
    if (newValue === 2) {
      const requestData = await getLogs();
      setLogData(requestData);
    }
  };

  async function getLogs() {
    const result = await fetch(
      "../interfaces/interfaz_ypf_dispositivos.php?operation=get&entity=logs"
    );
    const json_data = await result.json();
    return json_data.data.logs;
  }

  return (
    <div className={classes.root}>
      <Typography align="left" variant="h4" style={{ marginBottom: 40 }}>
        Gestion de Unidades
      </Typography>
      <div className={classes.root}>
        <div className={classes.demo1}>
          <AntTabs
            value={value}
            onChange={handleChange}
            aria-label="ant example"
          >
            <AntTab label="Nueva unidad" {...a11yProps(0)} />
            <AntTab label="Eliminar unidad" {...a11yProps(1)} />
            <AntTab label="Registro de Actividad" {...a11yProps(2)} />
          </AntTabs>
          <Typography className={classes.padding} />
          <TabPanel value={value} index={0}>
            <Create
              transportists={transportists}
              terminals={terminals}
            ></Create>
          </TabPanel>
          <TabPanel value={value} index={1}>
            <Delete patents={patents}></Delete>
          </TabPanel>
          <TabPanel value={value} index={2}>
            <Logs logs={logData}></Logs>
          </TabPanel>
        </div>
      </div>
    </div>
  );
}

AbmTabs.defaultProps = {};

AbmTabs.propTypes = {
  patents: PropTypes.array,
  transportists: PropTypes.array,
  terminals: PropTypes.array,
};
