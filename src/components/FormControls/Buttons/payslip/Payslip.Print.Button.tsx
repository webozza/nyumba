import React from 'react';
import { useMutation } from 'react-query';
import { LoadingButton } from '../../../Buttons/Button.Loading';
import PayslipService from '../../../../lib/services/Payslip.service';
import { IPrintPayslipProps } from '../../../../lib/interfaces/Payslip.interface';
import { useSearchParams } from 'react-router-dom';
import moment from 'moment';

interface Props {
	employeeId: string;
	disabled?: boolean;
}
export const PrintPayslipButton = ({ employeeId, disabled }: Props) => {
	const [params] = useSearchParams();
	const date = params.get('date');
	const [printing, setPrinting] = React.useState<boolean>(false);

	const printPayslip = useMutation<any, Error, any>(async (props: IPrintPayslipProps) => PayslipService.getPayslipPDF(props), {
		onMutate: () => setPrinting(true),
		onSettled: () => setPrinting(false),
		onSuccess: (url: string) => {
			const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
			if (newWindow) newWindow.opener = null;
		},
	});

	return (
		<LoadingButton
			label=""
			startIcon="print"
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
