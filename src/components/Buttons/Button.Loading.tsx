import { LoadingButton as MUILoadingButton } from '@mui/lab';
import { ButtonProps, Icon, Typography } from '@mui/material';

interface Props {
	label: string;
	icon?: string;
	startIcon?: string;
	disabled?: boolean;
	isLoading?: boolean;
	onClick?: () => void;
	buttonProps?: ButtonProps;
}

export const LoadingButton = ({ label, icon, startIcon, disabled, onClick, isLoading, buttonProps }: Props) => {
	return (
		<MUILoadingButton
			onClick={onClick}
			loading={isLoading}
			variant="text"
			disabled={disabled}
			endIcon={icon && <Icon>{icon}</Icon>}
			startIcon={startIcon && <Icon>{startIcon}</Icon>}
			color="primary"
			{...buttonProps}
		>
			<Typography variant="body2">{label}</Typography>
		</MUILoadingButton>
	);
};
