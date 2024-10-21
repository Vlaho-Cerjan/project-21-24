import { styled } from '@mui/material';
import { ArrowButton } from '../../project-player/layoutPage/styledComponents/carouselStyledComponents';

export const GridArrow = styled(ArrowButton)(({ theme }) => ({
    position: "relative",
    top: 0,
    transform: "none",
    backgroundColor: theme.palette.background.paper,

    '&:first-of-type': {
        marginRight: "15px",

        [theme.breakpoints.down('md')]: {
            marginRight: "8px",
        }
    },

    '&:disabled': {
        opacity: 0.5,
    }
}))