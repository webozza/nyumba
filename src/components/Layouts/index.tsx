import { DefaultLayout } from './Layout.Default';
import { MobileLayout } from './Layout.Mobile';

export const Layout = () => {
  const width = window.innerWidth

  if (width <= 768) return <MobileLayout />
  return <DefaultLayout />
};
