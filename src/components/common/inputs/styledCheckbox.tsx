import React from 'react';
import { Checkbox, FormControlLabel } from '@mui/material';
import { IconContainerGrey } from '../iconContainer/iconContainer';
import { CheckBoxOutlineBlankRounded, CheckBoxRounded } from '@mui/icons-material';

interface CheckboxProps {
    handleChangeFunction?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    label?: string;
    defaultChecked?: boolean;
}

/*
    <StyledCheckbox
        handleChangeFunction={(e) => { console.log(e.target.checked) }}
        label='test'
        defaultChecked={false}
    />
*/

export default function StyledCheckbox({handleChangeFunction, label, defaultChecked}: CheckboxProps) {
    const [checked, setChecked] = React.useState(defaultChecked);
    const checkboxRef = React.useRef<HTMLButtonElement>(null);

    React.useEffect(() => {
        setChecked(defaultChecked);
    }, [defaultChecked]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked(event.target.checked);
        if(typeof handleChangeFunction !== "undefined") handleChangeFunction(event);
    };

    return (
        <FormControlLabel
            sx={{ fontSize: "14px", '& span': { fontWeight: "700", fontSize: "1em", color: "text.secondary" } }} 
            control={
                <Checkbox
                    sx={{
                        '.MuiSvgIcon-root': {
                            fontSize: "24px",
                            borderRadius: "8px"
                        }
                    }}
                    icon={<IconContainerGrey sx={{ fontSize: "24px" }}><CheckBoxOutlineBlankRounded /></IconContainerGrey>}
                    checkedIcon={<IconContainerGrey className='active' sx={{ fontSize: "24px" }}><CheckBoxRounded /></IconContainerGrey>}
                    checked={checked}
                    disableRipple
                    onChange={handleChange}
                    inputProps={{ 'aria-label': label }}
                />
            }
            label={(typeof label !== "undefined")?label:""}
        />
    );
}