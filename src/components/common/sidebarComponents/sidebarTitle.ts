import { styled, Typography } from "@mui/material";

export const SidebarTitle = styled(Typography)(({theme}) => ({
    fontSize: "1em",
    fontWeight: 900,
    lineHeight: "20px",
    marginLeft: "25px",
    marginBottom: "14px",
    textTransform: "uppercase",
    color: theme.palette.text.secondary
}))