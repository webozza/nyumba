import { DefaultEmployeesPage } from "./Employees.Default";
import { MobileEmployeesPage } from "./Employees.Mobile";
import { DefaultEmployeePage } from "./Employee.Default";
import { MobileEmployeePage } from "./Employee.Mobile";

export const EmployeesPage = () => {
  const width = window.innerWidth

  if (width <= 768) return <MobileEmployeesPage />
  return <DefaultEmployeesPage />
};

export const EmployeePage = () => {
  const width = window.innerWidth

  if (width <= 768) return <MobileEmployeePage />
  return <DefaultEmployeePage />
};
