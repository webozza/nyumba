export function toCurrencyText(amount: number, decimal?: number) {
	return new Intl.NumberFormat('en-US', {
		minimumFractionDigits: decimal || 2,
		maximumFractionDigits: decimal || 2,
	}).format(amount || 0);
}

export function toNumberText(amount: number) {
	return new Intl.NumberFormat('en-ZA', {
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(amount || 0);
}

export function toNumber(amount: string | number): number {
	return Number(amount?.toString().replaceAll('%', '').replaceAll(',', '').replaceAll('R', '').replaceAll(' ', '') || 0);
}

export const toProperCase = (str?: string) => {
	if (!str) return;
	if (str === 'nowshow') return 'No Show';
	if (str === 'notpaid') return 'Active - Not paid';
	if (str === 'awaiting_approval') return 'Awaiting quote approval';
	if (str === 'rejected') return 'Quote rejected';
	if (str === 'accepted') return 'Quote accepted';
	if (str === 'recieved') return 'In progress';
	return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const copyTextToClipboard = async (text: string) => {
	try {
		await navigator.clipboard.writeText(text);
	} catch {
		throw new Error('Not able to copy');
	}
};
