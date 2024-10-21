import { EmailOutlined, LockOutlined } from "@mui/icons-material";
import { Box, FormControl, Grid } from '@mui/material';
import { signIn } from "next-auth/react";
import { useRouter } from 'next/router';
import { useSnackbar } from "notistack";
import React, { useContext, useState } from "react";
import { ExceptionStrings } from '../../lang/common/exceptions';
import { GenericText } from "../../lang/common/genericText";
import { FetchError } from "../../lib/fetchJson";
import { AccessibilityContext } from "../../store/providers/accessibilityProvider";
import useTranslation from '../../utility/useTranslation';
import StyledInput from "../common/inputs/styledInput";
import Link from "../common/navigation/Link";
import { StyledLabel } from '../common/styledLabel/styledLabel';
import { TextBold20 } from '../common/styledText/styledText';
import { LoginStrings } from './lang/loginStrings';
import { StyledAuthBoxContainer, StyledAuthButton } from './styledComponents/authStyledComponents';

const LoginComponent = () => {
    const { theme } = useContext(AccessibilityContext);

    const router = useRouter();

    const { t } = useTranslation(ExceptionStrings);

    const loginStrings = useTranslation(LoginStrings).t;

    const genericText = useTranslation(GenericText).t;

    const { enqueueSnackbar } = useSnackbar();

    const [inputError, setInputError] = useState(false);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    React.useEffect(() => {
        if (typeof t !== "undefined" && typeof enqueueSnackbar !== "undefined" && router.query.error?.toString().includes("CredentialsSignin")) {
            enqueueSnackbar(t("authentication_failed"), { variant: "error" });
            setInputError(true);
        }
    }, [router.query.error]);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        setInputError(false);

        const body = {
            email: event.currentTarget.email.value,
            password: event.currentTarget.password.value,
        };

        try {
            const response: any = await signIn('credentials', {
                redirect: true,
                email: body.email,
                password: body.password,
                callbackUrl: (router.query.callbackUrl) ? decodeURI(router.query.callbackUrl.toString()) : "/",
            });

            if (response && !response.ok) {
                enqueueSnackbar(t("authentication_failed"), { variant: "error" });
                setInputError(true);
            } else {
                setSuccess(true);
            }

            setLoading(false);
        } catch (error) {
            if (error instanceof FetchError) {
                console.error("An unexpected error happened:", error.data.message);
            } else {
                console.error("An unexpected error happened:", error);
            }

            setLoading(false);
        }
    }

    return (
        <StyledAuthBoxContainer>
            <TextBold20
                text={loginStrings("signInToProject")}
                containerSx={{
                    padding: "25px 0 35px"
                }}
                textComponent="h1"
            />
            <Box component="form" autoComplete="off" onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12} textAlign="start" sx={{ pb: "20px" }}>
                        <FormControl fullWidth>
                            {StyledLabel(genericText("email"))}
                            <StyledInput
                                required
                                error={inputError}
                                inputPlaceholder={genericText("yourEmail")}
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                inputIcon={<EmailOutlined />}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} textAlign="start" sx={{ pt: "20px", pb: "20px" }}>
                        {StyledLabel(genericText("password"))}
                        <StyledInput
                            required
                            error={inputError}
                            inputPlaceholder={genericText("yourPassword")}
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            inputIcon={<LockOutlined />}
                        />
                    </Grid>
                    <Grid item xs={12} textAlign="center" sx={{ pt: "20px", pb: "38px" }}>
                        <Link color={theme.palette.text.secondary} underline="hover" fontSize="12px" fontWeight={900} lineHeight="15px" href="/auth/forgot-password">
                            {loginStrings("resetPassword")}
                        </Link>
                    </Grid>
                </Grid>
                <StyledAuthButton success={success} loading={loading} buttonText={loginStrings("signIn")} />
            </Box>
        </StyledAuthBoxContainer>
    )
}

export default LoginComponent;