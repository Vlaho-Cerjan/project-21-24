import { Box, styled, Typography } from "@mui/material";
import { Navigation } from '../../../constants/navigation';
import useTranslation from '../../../utility/useTranslation';
import { NavigationStrings } from '../../../lang/common/constants/navigation';
import NavItems from './navItems';

const StyledNavChildrenContainer = styled(Box)`
    display: flex;
    flex-direction: column;
    padding-bottom: 30px;
`

const NavLabelText = styled(Typography)(({theme}) => ({
    textTransform: "uppercase",
    fontSize: "1em",
    lineHeight: "20px",
    textIndent: "25px",
    paddingBottom: "14px",
    color: theme.palette.text.secondary,
    fontWeight: 900,
}))

const Nav = () => {
    const { t } = useTranslation(NavigationStrings);

    const navDisplay = Navigation.map((item, index) => {
        return (
            <Box key={"navItem_"+index}>
                <Box sx={{ fontSize: "12px" }} >
                    <NavLabelText className="navLabelText" >{t(item.title)}</NavLabelText>
                </Box>
                <StyledNavChildrenContainer>
                    <NavItems item={item} index={index} />
                </StyledNavChildrenContainer>
            </Box>
        );
    })

    return(
        <Box>
            {navDisplay}
        </Box>
    )
}

export default Nav;