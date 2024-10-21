import { Box, styled } from '@mui/material';
import useTranslation from '../../../utility/useTranslation';
import { PageTitleStrings } from './lang/pageTitleStrings';
import { TextBold20, TextBold14 } from '../styledText/styledText';

const StyledTitleContainer = styled(Box)`
    display: flex;
    align-items: flex-end;
`

const StyledDividerBox = styled(Box)(({ theme }) => ({
    margin: "0px 8px",
    color: theme.palette.text.secondary,
}))

interface PageTitleProps {
    title: string;
    results: string;
}

const PageTitle = ({title, results}: PageTitleProps) => {

    const { t } = useTranslation(PageTitleStrings);

    return (
        <StyledTitleContainer>
            <TextBold20
                text={title}
                textComponent="h1"
                containerSx={{
                    lineHeight: "24px"
                }}
            />
            <StyledDividerBox>
                /
            </StyledDividerBox>
            <TextBold14
                text={results+" "+t("results")}
                containerSx={{
                    lineHeight: "20px"
                }}
                textProps={{
                    sx: {
                        color: "text.secondary"
                    }
                }}
            />
        </StyledTitleContainer>
    );
}

export default PageTitle;