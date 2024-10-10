import { DefaultDashboardPage } from "./Dashboard.Default";
import { MobileDashboardPage } from "./Dashboard.Mobile";

export const DashboardPage = () => {
  const width = window.innerWidth

  if (width <= 768) return <MobileDashboardPage />
  return <DefaultDashboardPage />
};
