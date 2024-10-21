import { CloseRounded, MenuRounded } from "@mui/icons-material";
import { Avatar, Box, Button, Divider, Skeleton, styled, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import Image from 'next/image';
import { useContext, useEffect, useState } from "react";
import LogoDark from '../../../../public/Images/authLayout/logo.svg';
import LogoLight from '../../../../public/Images/authLayout/logo_white.svg';
import { AccessibilityContext } from "../../../store/providers/accessibilityProvider";
import useWindowSize from '../../../utility/windowSize';
import { IconContainerGrey } from "../../common/iconContainer/iconContainer";
import HeaderInput from './input/input';
import User from "./user/user";

const HeaderBox = styled(Box)`
    display: flex;
    height: 92px;

    > div {
        flex: 1 1 auto;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        text-align: center;
    }
`
interface HeaderProps {
    searchTitle?: string,
    buttonIcon?: JSX.Element,
    setSearchResult?: React.Dispatch<React.SetStateAction<string | null>>,
    buttonTitle?: string,
    buttonHref?: string,
    noSearch?: boolean,
    noButton?: boolean,
    active: boolean,
    setActive: (active: boolean) => void,
    setONB: (onb: boolean) => void,
    hamburgerButtonRef: React.RefObject<HTMLButtonElement>,
    searchLoading: boolean,
}

const Header = ({searchTitle, setSearchResult, searchLoading, buttonIcon, buttonTitle, buttonHref, noSearch, noButton, active, setActive, setONB, hamburgerButtonRef}: HeaderProps) => {
    const { accessibility: { isDark }, theme } = useContext(AccessibilityContext);

    const { width } = useWindowSize();

    const [logo, setLogo] = useState(LogoLight);

    const { status } = useSession();

    useEffect(() => {
        if(isDark) setLogo(LogoLight);
        else setLogo(LogoDark);

        return () => {
            setLogo(LogoLight);
        }
    }, [isDark])

    return (
        <HeaderBox component={"header"}>
            <Box
                maxWidth={(width > theme.breakpoints.values.lg)?260:"100%"}
                sx={{
                    display: "flex",
                    padding: "0 40px",
                    justifyContent: "left !important",

                    [theme.breakpoints.down("md")]: {
                        padding: "0 20px",
                    },

                    [theme.breakpoints.down("sm")]: {
                        padding: "0 16px",
                    }
                }}
            >
                {width<theme.breakpoints.values.lg?
                    <Button
                    ref={hamburgerButtonRef}
                    sx={{
                      padding: "4px",
                      minWidth: "auto",
                      marginRight: "13px",
                      marginLeft: "-7px",
                      boxShadow: "none !important",
                    }}
                    onClick={() => {setActive(!active); setONB(!active);}}
                  >
                    <IconContainerGrey
                        sx={{
                            fontSize: "27px",
                            '& svg': {
                                fill: (theme.palette.mode === "dark")?theme.palette.text.secondary+" !important":theme.palette.text.primary+" !important",

                                '&:hover': {
                                    fill: (theme.palette.mode === "dark")?theme.palette.text.primary+" !important":theme.palette.text.primary+" !important",
                                }
                            },
                        }}>
                    {
                      active
                      ?
                        <CloseRounded />
                      :
                        <MenuRounded />
                    }
                    </IconContainerGrey>
                  </Button>
                :null}
                <Image
                    src={logo}
                    alt="logo that is made out of words project.tv cms"
                    quality={100}
                    width={150}
                    height={25}
                />
            </Box>
            {
                (width >= theme.breakpoints.values.lg)
                ?
                <HeaderInput
                    searchTitle={searchTitle}
                    setSearchResult={setSearchResult}
                    buttonIcon={buttonIcon}
                    buttonTitle={buttonTitle}
                    buttonHref={buttonHref}
                    noSearch={noSearch}
                    noButton={noButton}
                    searchLoading={searchLoading}
                />
                :
                null
            }
            <Divider sx={{ borderRightWidth: "2px" }} flexItem orientation="vertical" />
            <Box maxWidth={260} sx={{ flexGrow:(width < theme.breakpoints.values.sm)?"0 !important":1 }}>
                {status === "loading"
                ?
                    <Box sx={{ display: "flex", minWidth: "64px", justifyContent: "center" }}>
                        <Skeleton variant="text" width={20} sx={{ mr: width<theme.breakpoints.values.sm?0:"10px" }}>
                            <Avatar />
                        </Skeleton>
                        {width>=theme.breakpoints.values.sm?
                        <Skeleton variant="text" width={100}>
                            <Typography>.</Typography>
                        </Skeleton>
                        :null}
                    </Box>
                :
                    <User />
                }
            </Box>
        </HeaderBox>
    )
}

export default Header;