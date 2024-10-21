import { Button, ButtonProps, BoxProps } from '@mui/material';
import React from 'react';
import { IconContainerGrey } from "../iconContainer/iconContainer"
import { AccessibilityContext } from '../../../store/providers/accessibilityProvider';
import { CoreBg } from '../../core/coreBackground';

interface ArrowButtonProps {
    icon: JSX.Element,
    buttonProps: ButtonProps,
    props?: BoxProps,
}

const ArrowButton = ({ icon, buttonProps, props }: ArrowButtonProps) => {
    const { theme, accessibility: { isDark } } = React.useContext(AccessibilityContext);

    const panelProps = props || {};

    return (
        <CoreBg
            {...panelProps}
            sx={{ width: "44px !important", height: "44px !important", borderRadius: "50%", ...panelProps.sx }}
        >
            <Button
                sx={{
                    width: "44px",
                    height: "44px",
                    padding: "10px",
                    borderRadius: "50%",
                    minWidth: "44px !important",
                    color: theme.palette.text.secondary,
                    boxShadow: "none !important",
                    border: isDark ? "2px solid rgba(255, 255, 255, 0.24)" : undefined,

                    '&:disabled': {
                        backgroundColor: theme.palette.grey[600],
                        opacity: 0.5,
                    },
                }}
                {...buttonProps}
            >
                <IconContainerGrey className="darker" sx={{ fontSize: "24px" }}>
                    {icon}
                </IconContainerGrey>
            </Button>
        </CoreBg>
    )
}

export default ArrowButton;