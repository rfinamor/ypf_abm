import { DireflowComponent } from "direflow-component";
import App from "./App";

export default DireflowComponent.create({
  component: App,
  configuration: {
    tagname: "ypf-device-abm",
  },
  plugins: [
    {
      name: "font-loader",
      options: {
        google: {
          families: ["Roboto"],
        },
      },
    },
    {
      name: "icon-loader",
      options: {
        packs: ["material-icons"],
      },
    },
    {
      name: "material-ui",
    },
  ],
});
