import { AccountCircleOutlined, ExpandMore } from "@mui/icons-material";
import { Box } from "@mui/material";
import { signOut, useSession } from "next-auth/react";
import { useContext } from 'react';
import { AccessibilityContext } from "../../../../store/providers/accessibilityProvider";
import useTranslation from '../../../../utility/useTranslation';
import useWindowSize from '../../../../utility/windowSize';
import StyledDropdown from '../../../common/inputs/styledDropdown';
import { CoreBg } from '../../coreBackground';
import { UserStrings } from './lang/userStrings';

const User = () => {
    const { theme } = useContext(AccessibilityContext);

    const { width } = useWindowSize();

    const { t } = useTranslation(UserStrings);

    const { data } = useSession();

    const StartIcon = <Box component={"span"} sx={{
        lineHeight: "0",

        [theme.breakpoints.down('sm')]: {
            fontSize: "24px",
        }
    }}>
        <AccountCircleOutlined sx={{ fontSize: "1em !important", lineHeight: "0 !important" }} />
    </Box>

    const User = (
        (width >= theme.breakpoints.values.sm) ?
            data
                ?
                data.user.first_name + " " + data.user.last_name
                :
                t("user")
            :
            null
    )

    const EndIcon = (
        (width >= theme.breakpoints.values.sm) ?
            <ExpandMore />
            :
            null
    )

    const DropdownMenuItems = [
        {
            function: signOut,
            text: t("signOut"),
        },
    ]

    return (
        <CoreBg
            sx={{
                [theme.breakpoints.down('sm')]: {
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }
            }}
            className="inactive"
        >
            <StyledDropdown
                buttonId='user-dropdown-button'
                startIcon={StartIcon}
                buttonText={User}
                endIcon={EndIcon}
                dropdownId='user-dropdown'
                dropdownMenuItems={DropdownMenuItems}
                noBackground
            />
        </CoreBg>
    )
}

export default User;