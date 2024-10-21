import { Grid } from "@mui/material";
import { ExceptionStrings } from "../../lang/common/exceptions";
import useTranslation from "../../utility/useTranslation";
import { useSnackbar } from "notistack";
import { useRef, useState } from "react";
import { ForgotPasswordStrings } from "./lang/forgotPasswordStrings";
import { StyledAuthBoxContainer, StyledAuthButton } from './styledComponents/authStyledComponents';
import { EmailOutlined } from '@mui/icons-material';
import StyledInput from "../common/inputs/styledInput";
import { StyledLabel } from "../common/styledLabel/styledLabel";
import { GenericText } from '../../lang/common/genericText';
import { TextBold20, TextBlack12 } from '../common/styledText/styledText';
import { Error } from "../../interfaces/error/error";
import { RefreshIfLoggedOut } from '../../lib/refreshIfLoggedOut';
import React from "react";

const ForgotPasswordComponent = () => {
    const { t } = useTranslation(ExceptionStrings);
    const genericText = useTranslation(GenericText).t;
    const forgotPasswordStrings = useTranslation(ForgotPasswordStrings).t;

    const { enqueueSnackbar } = useSnackbar();

    const [inputError, setInputError] = useState(false);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const formRef = useRef<HTMLFormElement>(null);

    const abortController = new AbortController();

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        setInputError(false);

        fetch('/api/auth/forgot-password', {
            method: "PUT",
            body: JSON.stringify({
                email: event.currentTarget.email.value
            }),
            signal: abortController.signal
        })
            .then(async (response) => {
                if (response.ok) {
                    enqueueSnackbar(t("successful_password_request"), { variant: "success" });
                    formRef.current?.reset();
                    setSuccess(true);
                    setTimeout(() => {
                        setSuccess(false);
                    }, 2000);
                }
                else return Promise.reject(await response.json());
            })
            .catch((err: Error) => {
                if (abortController.signal.aborted) {
                    console.log('The user aborted the request');
                } else {
                    RefreshIfLoggedOut(err.message);
                    enqueueSnackbar(t("invalid_email"), { variant: "error" });
                    setInputError(true);
                    //console.error('The request failed');
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }

    return (
        <StyledAuthBoxContainer>
            <TextBold20
                text={forgotPasswordStrings("resetPassword")}
                containerSx={{
                    padding: "25px 0 35px"
                }}
                textComponent="h1"
            />
            <form ref={formRef} onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12} textAlign="start" sx={{ pb: "20px" }}>
                        {StyledLabel(genericText("email"))}
                        <StyledInput
                            required
                            error={inputError}
                            helperText={inputError ? forgotPasswordStrings("emailNotFound") : null}
                            id="email"
                            inputChangeFunction={() => (inputError) ? setInputError(false) : null}
                            name="email"
                            autoComplete="email"
                            type="email"
                            inputPlaceholder={genericText("yourEmail")}
                            InputLabelProps={{
                                sx: { color: success ? "success.main" : null }
                            }}
                            InputProps={{
                                sx: {
                                    '> fieldset': {
                                        borderColor: success ? "success.main" : null,
                                        borderWidth: success ? "2px" : null,
                                    }
                                }
                            }}
                            inputIcon={<EmailOutlined />}
                        />
                    </Grid>
                    <Grid item xs={12} textAlign="left" sx={{ pt: "20px !important", pb: "40px" }}>
                        <TextBlack12
                            text={success ? forgotPasswordStrings("checkMail") : forgotPasswordStrings("enterEmail")}
                            containerSx={{
                                padding: "0 20px",
                                lineHeight: "20px",
                            }}
                            textProps={{
                                sx: {
                                    color: "text.secondary"
                                }
                            }}
                        />
                    </Grid>
                </Grid>
                <StyledAuthButton success={success} loading={loading} buttonText={forgotPasswordStrings("sendSecureLink")} />
            </form>
        </StyledAuthBoxContainer>
    )
}

export default ForgotPasswordComponent;