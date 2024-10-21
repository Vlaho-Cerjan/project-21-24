import { Typography, styled } from '@mui/material';
export const StyledButtonText = styled(Typography)`
font-size: 1em;
line-height: 1em;
color: ${props => props.theme.palette.primary.contrastText};
`