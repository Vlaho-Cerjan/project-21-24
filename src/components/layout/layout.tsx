import { Container, Divider, Box, styled, Backdrop } from '@mui/material';
import Head from "next/head";
import useTranslation from '../../utility/useTranslation';
import { LayoutStrings } from './layoutStrings';
import { useRef, useState, useEffect, useContext, ReactElement } from 'react';
import React from "react";
import Accessibility from '../core/accessibility/accessibility';
import useWindowSize from '../../utility/windowSize';
import Sticky from 'react-stickynode';
import { AccessibilityContext } from '../../store/providers/accessibilityProvider';
import Header from '../core/header/header';
import HeaderInput from '../core/header/input/input';
import Nav from '../core/nav/nav';


interface LayoutProps {
  children: ReactElement,
  title: string, // set string in LayoutStrings.ts and call it on the page
  /** Set Translation In headerStrings.tsx File */
  searchTitle?: string, // set string in LayoutStrings.ts and call it on the page
  buttonIcon?: JSX.Element,
  /** Set Translation In headerStrings.tsx File */
  buttonTitle?: string, // set string in LayoutStrings.ts and call it on the page
  buttonHref?: string,
  noSearch?: boolean,
  noButton?: boolean,
}

const StyledBox = styled(Box)`
  display: flex;
`

const NavBox = styled(Box)`
  width: 100%;
  max-width: 100%;
  width: 260px;
  padding: 48px 15px;
  overflow: auto;
`

const StyledMain = styled("main")(({ theme }) => ({
  padding: "74px 0",
  width: "100%",
  maxWidth: "100%",
  overflow: "hidden",

  [theme.breakpoints.down("lg")]: {
    padding: "48px 0",
  },

  [theme.breakpoints.down("md")]: {
    padding: "40px 0",
  },
}))


export default function Layout({ children, title, searchTitle, buttonIcon, buttonTitle, buttonHref, noSearch, noButton }: LayoutProps) {
  const { t } = useTranslation(LayoutStrings);

  const headerRef = useRef<HTMLDivElement>(null);

  const { width } = useWindowSize();

  const { accessibility, theme } = useContext(AccessibilityContext);

  const [headerHeight, setHeaderHeight] = useState(94);
  const [navWidth, setNavWidth] = useState(260);

  const [searchResult, setSearchResult] = useState<string | null>(null);

  const [active, setActive] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  const [openNavBackdrop, setONB] = useState(false);

  useEffect(() => {
    if (typeof headerRef !== "undefined" && headerRef.current) setHeaderHeight(headerRef.current.clientHeight);

    return () => {
      setHeaderHeight(94);
    }
  }, [headerRef])

  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (typeof navRef !== "undefined" && navRef.current) setNavWidth(navRef.current.clientWidth);
    }, 10)

    return () => clearTimeout(timeout);
  }, [navRef, accessibility.fontSize])

  const handleCloseONB = () => {
    setONB(false);
    setActive(false);
  }

  const hamburgerButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <Box sx={{
      '@media (min-width: 1441px)': {
        backgroundColor: theme.palette.background.default + " !important",
        maxWidth: "1440px",
        margin: "0 auto",
        borderRight: "2px solid " + theme.palette.divider,
        borderLeft: "2px solid " + theme.palette.divider,
      }
    }}>
      <Head>
        <title>{t(title)}</title>
      </Head>
      <div ref={headerRef}>
        <Header
          searchTitle={searchTitle}
          setSearchResult={setSearchResult}
          buttonIcon={buttonIcon}
          buttonTitle={buttonTitle}
          buttonHref={buttonHref}
          noSearch={noSearch}
          noButton={noButton}
          active={active}
          setActive={setActive}
          setONB={setONB}
          hamburgerButtonRef={hamburgerButtonRef}
          searchLoading={searchLoading}
        />
        <Divider sx={{ borderBottomWidth: "2px" }} />
      </div>
      <StyledBox
        className="layoutStickyContainer"
        sx={{
          minHeight: "calc(100vh - " + (headerHeight) + "px)",
          position: "relative",
          //marginBottom: "92px",
        }}
      >
        <Box sx={{
          display: "flex",
          width: "100%",
        }}>
          <Box
            sx={{
              height: "100%",
              position: "relative",
              maxWidth: "100%",
              width: navWidth,
              minWidth: navWidth,

              [theme.breakpoints.down("lg")]: {
                position: "absolute",
                left: active ? 0 : -navWidth - 2,
                transition: "left 0.5s ease-in-out",
                backgroundColor: theme.palette.background.paper,
                zIndex: active ? theme.zIndex.drawer + 5 : theme.zIndex.drawer + 3,
              },
            }}
          >
            <Sticky top={0}>
              <Box>
                <NavBox
                  ref={navRef}
                >
                  <Nav />
                </NavBox>
              </Box>
            </Sticky>
          </Box>
          <Backdrop
            sx={{ position: "absolute", zIndex: active ? theme.zIndex.drawer + 4 : theme.zIndex.drawer + 2 }}
            open={openNavBackdrop}
            onClick={handleCloseONB}
          />
          <Divider orientation="vertical" flexItem sx={{ borderRightWidth: "2px" }} />
          <StyledMain>
            <Container disableGutters maxWidth={false} sx={{ height: "100%" }}>
              {(width < theme.breakpoints.values.lg && !noSearch && !noButton)
                ?
                <Box sx={{
                  padding: "0 40px 20px",

                  [theme.breakpoints.down('md')]: {
                    padding: "0 20px 20px",
                  },

                  [theme.breakpoints.down('sm')]: {
                    padding: "0 10px 20px",
                  }

                }}>
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
                </Box>
                :
                null
              }
              {React.cloneElement(children, { searchResult: searchResult, setSearchLoading: setSearchLoading, setSearchResult: setSearchResult })}
            </Container>
          </StyledMain>
        </Box>
        <Accessibility />
      </StyledBox>
      {//<div>
        // <VideoFooter />
        //</div>
      }
    </Box>
  );
}