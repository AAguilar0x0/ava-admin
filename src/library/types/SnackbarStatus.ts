const SnackbarStatus = ['none', 'success', 'warning', 'error'] as const;

export type TSnackbarStatus = (typeof SnackbarStatus)[number];

export default SnackbarStatus;
