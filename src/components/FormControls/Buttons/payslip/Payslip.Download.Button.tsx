import React from 'react';
import { useMutation } from 'react-query';
import { LoadingButton } from '../../../Buttons/Button.Loading';
import PayslipService from '../../../../lib/services/Payslip.service';
import { IPrintPayslipProps } from '../../../../lib/interfaces/Payslip.interface';
import { useSearchParams } from 'react-router-dom';
import moment from 'moment';
import download from 'downloadjs';

interface Props {
	employeeId: string;
	disabled?: boolean;
}
interface IResponseProps {
	data: Blob;
	filename: string;
	mimeType: string;
}
export const DownloadPayslipButton = ({ employeeId, disabled }: Props) => {
	const [params] = useSearchParams();
	const date = params.get('date');
	const [printing, setPrinting] = React.useState<boolean>(false);

	const printPayslip = useMutation<any, Error, any>(async (props: IPrintPayslipProps) => PayslipService.downloadPayslipPDF(props), {
		onMutate: () => setPrinting(true),
		onSettled: () => setPrinting(false),
		onSuccess: async ({ data, filename, mimeType }: IResponseProps) => {
			download(data, filename, mimeType);
		},
	}); 

	return (
		<LoadingButton
			label=""
			startIcon="download"
			onClick={() => {
				printPayslip.mutate({
					employeeId,
					month: Number(moment(date).format('MM')),
					year: Number(moment(date).format('YYYY')),
				});
			}}
			disabled={disabled}
			isLoading={printing}
		/>
	);
};
