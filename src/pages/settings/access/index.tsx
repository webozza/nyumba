import { DefaultUserAdminPage } from "./Employee.Default";
import { MobileUserAdminPage } from "./Employee.Mobile";

export const EmployeeAccessAdminPage = () => {
  const width = window.innerWidth

  if (width <= 768) return <MobileUserAdminPage />
  return <DefaultUserAdminPage />
};
