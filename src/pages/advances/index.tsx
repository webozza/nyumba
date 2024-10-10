import { DefaultAdvancesPage } from './Advances.Default';
import { MobileAdvancesPage } from './Advances.Mobile';

export const AdvancesPage = () => {
	const width = window.innerWidth;

	if (width <= 768) return <MobileAdvancesPage />;
	return <DefaultAdvancesPage />;
};
