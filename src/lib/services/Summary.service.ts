import nyumbaApi from '../data/axios';

// - v2
const getSummary = async (props: any): Promise<any> => {
	const data = await nyumbaApi({
		method: 'get',
		url: `/v2/summary?month=${props?.queryKey[1]?.month}&year=${props?.queryKey[1]?.year}`,
	})
		.then((res: any) => {
			return res.data.summary;
		})
		.catch((reason) => {
			throw new Error(reason.response.data.message);
		});
	return data;
};

const SummaryService = {
	getSummary,
};

export default SummaryService;
