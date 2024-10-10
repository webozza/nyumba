import { muiTheme } from "storybook-addon-material-ui5";
import { nyumba_theme, nyumba_light, nyumba_dark } from "../src/lib/theme";

export const decorators = [
  muiTheme([
    {
      themeName: "Light",
      ...nyumba_theme,
      palette: {
        ...nyumba_theme.palette,
        ...nyumba_light.palette,
        mode: "light",
      },
    },
    {
      themeName: "Dark",
      ...nyumba_theme,
      palette: {
        ...nyumba_theme.palette,
        ...nyumba_dark.palette,
        mode: "dark",
      },
    },
  ]),
];

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};
