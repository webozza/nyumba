import nyumbaApi from '../data/axios';
import { IPrintPayslipProps } from '../interfaces/Payslip.interface';

const getPayslipPDF = async (props: any): Promise<IPrintPayslipProps[]> => {
	const data: any = await nyumbaApi({
		method: 'post',
		url: `/payslip/pdf`,
		data: JSON.stringify(props),
		responseType: 'blob',
	})
		.then((response: any) => {
			const file = URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
			return file;
		})
		.catch((reason) => {
			throw new Error(reason.response.data.message);
		});
	return data;
};

interface downloadPDFProps {
	data: string | Blob | File | Uint8Array;
	filename?: string;
	mimeType?: string;
}

const downloadPayslipPDF = async (props: any): Promise<downloadPDFProps> => {
	const data: any = await nyumbaApi({
		method: 'post',
		url: `/payslip/pdf`,
		data: JSON.stringify(props),
		responseType: 'blob',
	})
		.then((response: any) => {
			const filename = response.headers['x-suggested-filename'];
			return { data: response.data, filename, mimeType: 'application/pdf' };
		})
		.catch((reason) => {
			throw new Error(reason.response.data.message);
		});
	return data;
};

const getPayslipJSON = async (props: any): Promise<any> => {
	try {
		const response: any = await nyumbaApi({
			method: 'post',
			url: `/payslip/json`,
			data: JSON.stringify(props),
			responseType: 'json',
		});

		return response.data;
	} catch (error:any) {
		throw new Error(error.response.data.message);
	}
};

const downloadAllPayslipsZIP = async (props: any): Promise<downloadPDFProps> => {
	const response: unknown = await nyumbaApi({
		method: 'post',
		url: `/payslip/zip`,
		data: JSON.stringify(props),
		responseType: 'blob',
	});
  
	if (isAxiosResponse(response)) {
		const filename = response.headers['x-suggested-filename'];
		return {
			data: response.data,
			filename,
			mimeType: 'application/pdf' 
		};
	} else {
		throw new Error("Unexpected response format");
	}
};

function isAxiosResponse(obj: unknown): obj is { data: Blob, headers: { [key: string]: string } } {
	return !!obj && typeof obj === 'object' && 'data' in obj && 'headers' in obj;
}

const PayslipService = {
	getPayslipPDF,
	downloadPayslipPDF,
	downloadAllPayslipsZIP,
	getPayslipJSON
};

export default PayslipService;
