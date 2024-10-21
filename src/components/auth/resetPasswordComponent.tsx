import React, { useRef, useState } from 'react';
import router from 'next/router';
import { Grid } from '@mui/material';
import { ExceptionStrings } from '../../lang/common/exceptions';
import useTranslation from '../../utility/useTranslation';
import { useSnackbar } from 'notistack';
import { ResetPasswordStrings } from './lang/resetPasswordStrings';
import { StyledAuthBoxContainer, StyledAuthButton } from './styledComponents/authStyledComponents';
import { Cancel, LockOutlined } from '@mui/icons-material';
import StyledInput from '../common/inputs/styledInput';
import { StyledLabel } from '../common/styledLabel/styledLabel';
import { TextBlack12, TextBold20 } from '../common/styledText/styledText';
import { Error } from '../../interfaces/error/error';
import { RefreshIfLoggedOut } from '../../lib/refreshIfLoggedOut';

const ResetPasswordComponent = (): JSX.Element => {
    const { t } = useTranslation(ExceptionStrings);
    const resetPasswordStrings = useTranslation(ResetPasswordStrings).t;

    const { enqueueSnackbar } = useSnackbar();

    const [inputError, setInputError] = useState(false);
    const [confirmInputError, setConfirmInputError] = useState(false);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [clearPassword, setClearPassword] = useState(false);
    const [clearConfirmPassword, setClearConfirmPassword] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const formRef = useRef<HTMLFormElement>(null);

    const abortController = new AbortController();

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        setConfirmInputError(false);
        setInputError(false);

        const password = event.currentTarget.password.value;
        const passwordConfirm = event.currentTarget.passwordConfirm.value;

        if (password.toString() !== passwordConfirm.toString()) {
            enqueueSnackbar(t('passwords_not_matching'), { variant: 'error' });
            setInputError(true);
            setConfirmInputError(true);
            setLoading(false);
            return;
        }
        var passwordCheck = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/;
        if (!passwordCheck.test(password)) {
            setInputError(true);
            setConfirmInputError(true);
            setLoading(false);
            enqueueSnackbar(t('password_too_weak'), { variant: 'error' });
            return;
        } else {
            const resetToken = router.query.resetId;

            if (typeof resetToken === "undefined") {
                enqueueSnackbar(t("invalid_reset_password_code"), { variant: "error" });
                return;
            }

            fetch('/api/auth/password-reset', {
                method: "POST",
                body: JSON.stringify({
                    token: encodeURIComponent(resetToken.toString()),
                    password: password,
                    passwordConfirm: passwordConfirm,
                }),
                signal: abortController.signal,
            })
                .then(async (response) => {
                    if (response.ok) {
                        return response.json();
                    }
                    return Promise.reject(await response.json());
                })
                .then(() => {
                    enqueueSnackbar(t("password_success"), { variant: "success" });
                    formRef.current?.reset();
                    setSuccess(true);
                    setTimeout(() => {
                        router.push('/login');
                    }, 1000);
                })
                .catch((err: Error) => {
                    if (abortController.signal.aborted) {
                        console.log('The user aborted the request');
                    } else {
                        RefreshIfLoggedOut(err.message);
                        enqueueSnackbar(t("invalid_reset_password_code"), { variant: "error" });
                        setInputError(true);
                        setConfirmInputError(true);
                        //console.error('The request failed');
                    }
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }

    return (
        <StyledAuthBoxContainer>
            <TextBold20
                text={resetPasswordStrings("resetPassword")}
                containerSx={{
                    padding: "25px 0 35px"
                }}
                textComponent="h1"
            />
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12} textAlign="start" sx={{ pb: "12px" }}>
                        {StyledLabel(resetPasswordStrings("yourPassword"))}
                        <StyledInput
                            required
                            error={inputError}
                            clearInput={clearPassword}
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="new-password"
                            inputChangeFunction={(val) => {
                                setPassword(val);
                                if (inputError) setInputError(false);
                            }
                            }
                            inputIconFunction={() => {
                                if (password.length > 0) {
                                    setPassword("");
                                    setClearPassword(true);
                                    setTimeout(() => {
                                        setClearPassword(false);
                                    }, 100);
                                    if (inputError) setInputError(false);
                                }
                            }}
                            inputIcon={(password.length > 0) ? <Cancel /> : <LockOutlined />}
                            inputPlaceholder={resetPasswordStrings("yourPassword")}
                        />
                    </Grid>
                    <Grid item xs={12} textAlign="start" sx={{ pb: "20px" }}>
                        {StyledLabel(resetPasswordStrings("confirmPassword"))}
                        <StyledInput
                            required
                            error={confirmInputError}
                            clearInput={clearConfirmPassword}
                            id="passwordConfirm"
                            name="passwordConfirm"
                            type="password"
                            autoComplete="new-password"
                            inputChangeFunction={(val) => {
                                setConfirmPassword(val);
                                if (confirmInputError) setConfirmInputError(false);
                            }
                            }
                            inputIconFunction={() => {
                                if (confirmPassword.length > 0) {
                                    setConfirmPassword("");
                                    setClearConfirmPassword(true);
                                    setTimeout(() => {
                                        setClearConfirmPassword(false);
                                    }, 100);
                                    if (confirmInputError) setConfirmInputError(false);
                                }
                            }}
                            inputIcon={(confirmPassword.length > 0) ? <Cancel /> : <LockOutlined />}
                            inputPlaceholder={resetPasswordStrings("confirmPassword")}
                        />
                    </Grid>
                    <Grid item xs={12} textAlign="left" sx={{ pt: "20px", pb: "38px" }}>
                        <TextBlack12
                            text={success ? t("password_success") : resetPasswordStrings("requiredPassword")}
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
                <StyledAuthButton success={success} loading={loading} buttonText={resetPasswordStrings("resetYourPassword")} />
            </form>
        </StyledAuthBoxContainer>
    )
}

export default ResetPasswordComponent;