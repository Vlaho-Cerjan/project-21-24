import { Box, styled } from '@mui/material';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import Logo from '../../../public/Images/authLayout/logo_white.svg';
import SignInImage from '../../../public/Images/authLayout/signInImage-min.png';
import SignInImageMobile from '../../../public/Images/authLayout/signInImage-mobile.png';
import useWindowSize from '../../utility/windowSize';

const StyledBackgroundBox = styled(Box)`
    position: fixed;
    height: 100vh;
    width: 100vw;
    left: 0;
    top: 0;
    overflow: hidden;
    z-index: -1;

    > span{
        height: 100% !important;
    }
`

const StyledLogoBox = styled(Box)`
    position: absolute;
    top: 0;
    left: 0;
    padding: 16px;
`
const ContentBox = styled(Box)`
    display: flex;
    width: 100%;
    height: 100vh;
    justify-content: center;
    align-items: center;
`

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    const { width } = useWindowSize();

    const [bgImage, setBgImage] = useState(SignInImage);
    const [imageWidth, setImageWidth] = useState(2560);

    useEffect(() => {
        if(width<1024 && bgImage !== SignInImageMobile) {
            setBgImage(SignInImageMobile);
            setImageWidth(810);
        }
        else if(width >= 1024 && bgImage !== SignInImage) {
            setBgImage(SignInImage);
            setImageWidth(2560);
        }
    }, [width])

    return (
        <Box>
            <StyledBackgroundBox>
                <Image
                    src={bgImage}
                    alt="woman with purple hair and pink dress posing on a colorful background"
                    quality={90}
                    //width={imageWidth}
                    sizes='100%'
                    fill
                    priority
                    style={{
                        objectFit: 'cover',
                        objectPosition: 'center',
                        height: '100%',
                    }}
                />
            </StyledBackgroundBox>
            <StyledLogoBox>
                <Image
                    src={Logo}
                    alt="logo with words project.tv cms"
                    quality={90}
                    width={149}
                    height={24}
                />
            </StyledLogoBox>
            <ContentBox component={"main"}>
                {children}
            </ContentBox>
        </Box>
    )
}

export default AuthLayout;