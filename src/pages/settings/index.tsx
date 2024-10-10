import { SettingsMobilePage } from "./Settings.Mobile";
import { SettingsDefaultPage } from "./Settings.Default";

export const SettingsPage = () => {
  const width = window.innerWidth

  if (width <= 768) return <SettingsMobilePage />
  return <SettingsDefaultPage />
};
