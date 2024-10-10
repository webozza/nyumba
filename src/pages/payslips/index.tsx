import { DefaultPayslipsPage } from "./Payslips.Default";
import { MobileReviewPage } from "./Payslips.Mobile";

export const PayslipsPage = () => {
  const width = window.innerWidth

  if (width <= 768) return <MobileReviewPage />
  return <DefaultPayslipsPage />
};
