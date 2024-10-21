import { styled, Typography, Box, Theme, TypographyProps } from '@mui/material';

const StyledRatingContainer = styled(Box)`
    padding: 0;
    line-height: 12px;
    font-size: 10px;
    display: inline-flex;
`

const StyledRating = styled(Typography)(({ theme }: { theme: Theme }) => ({
    padding: "6px",
    minWidth: "53px",
    fontSize: "1em",
    lineHeight: "1.2em",
    textTransform: "uppercase",
    borderRadius: "6px",
    textAlign: "center",
    fontWeight: 900,
    '&.transparent': {
        minWidth: "44px",
        borderRadius: "3px",
        padding: "3px",
        lineHeight: "11px",
        backgroundColor: "rgba(0,0,32,0.32) !important",
        color: theme.palette.grey[50]+" !important",
    }
}))


export const RatingG = (props: TypographyProps) => (
    <StyledRatingContainer>
        <StyledRating
            sx={{
                backgroundColor: (theme: Theme) => theme.palette.success.light,
                color: (theme: Theme) => theme.palette.success.contrastText,
            }}
            {...props}
        >
            TV-G
        </StyledRating>
    </StyledRatingContainer>
)

export const RatingPG = (props: TypographyProps) => (
    <StyledRatingContainer>
        <StyledRating
            sx={{
                backgroundColor: (theme: Theme) => theme.palette.success.light,
                color: (theme: Theme) => theme.palette.success.contrastText,
            }}
            {...props}
        >
            TV-PG
        </StyledRating>
    </StyledRatingContainer>
)

export const Rating14 = (props: TypographyProps) => (
    <StyledRatingContainer>
        <StyledRating
            sx={{
                backgroundColor: (theme: Theme) => theme.palette.warning.light,
                color: (theme: Theme) => theme.palette.warning.contrastText,
            }}
            {...props}
        >
            TV-14
        </StyledRating>
    </StyledRatingContainer>
)

export const RatingMA = (props: TypographyProps) => (
    <StyledRatingContainer>
        <StyledRating
            sx={{
                backgroundColor: (theme: Theme) => theme.palette.error.main,
                color: (theme: Theme) => theme.palette.error.contrastText,
            }}
            {...props}
        >
            TV-MA
        </StyledRating>
    </StyledRatingContainer>
)

export const RatingPENDING = (props: TypographyProps) => (
    <StyledRatingContainer>
        <StyledRating
            sx={{
                backgroundColor: (theme: Theme) => theme.palette.grey[500],
                color: (theme: Theme) => theme.palette.grey[50],
            }}
            {...props}
        >
            PEND
        </StyledRating>
    </StyledRatingContainer>
)