import { Box, styled } from '@mui/material';

const StyledTipBox = styled(Box)(({ theme }) => ({
    minWidth: "36px",
    display: "inline-flex",
    justifyContent: "center",
    padding: "4px 6px",
    borderRadius: "2px",
    backgroundColor: theme.palette.mode !== "dark" ? "rgba(0,0,32,0.76)" : "rgba(255,255,255,0.76)",
    color: theme.palette.mode !== "dark" ? "#fff" : "#000",
    position: "relative",

}));

const Triangle = styled(Box)(({ theme }) => ({
    minWidth: 0,
    position: "absolute",
    bottom: "-6px",
    left: "50%",
    transform: "translateX(-50%)",
    border: "4px solid transparent",
    borderTopWidth: "3px",
    borderBottomWidth: "3px",
    height: "6px",
    borderTopColor: theme.palette.mode !== "dark" ? "rgba(0,0,32,0.76)" : "rgba(255,255,255,0.76)",

    '& > div': {
        width: "8px",
        height: "3px",
        position: "absolute",
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        overflow: "hidden",
    },

    '& .curve': {
        position: "absolute",
        width: "12px",
        height: "20px",
        borderRadius: "100%",
    },

    '& .topRight': {
        top: 0,
        right: "-6px",
    },

    '& .topLeft': {
        top: 0,
        left: "-6px",
    },
}));

const StyledTip = (
    {
        parentBackgroundColor,
        children,
        ...props
    }:
        {
            parentBackgroundColor: string,
            children: any,
        }
) => {

    return (
        <StyledTipBox
            {...props}
        >
            {children}
            <Triangle
                sx={{
                    '& .curve': {
                        backgroundColor: parentBackgroundColor,
                    }
                }}
            >
                <div>
                    <div className="curve topRight"></div>
                    <div className="curve topLeft"></div>
                </div>
            </Triangle>
        </StyledTipBox>
    )
}

export default StyledTip;