import { createMuiTheme } from "@material-ui/core/styles";
import { isDevelopment } from "../utils/index";
const theme = createMuiTheme({
  typography: {
    htmlFontSize: isDevelopment ? 16 : 11,
  },
  overrides: {
    MUIDataTableToolbar: {
      root: {
        height: 85
      }
    },
    MUIDataTableBodyCell: {
      root: {
        htmlFontSize: 16
      }
    },
    MUIDataTable: {
      root: {
        fontSize: 16
      },
    },
  }
});

export default theme;
