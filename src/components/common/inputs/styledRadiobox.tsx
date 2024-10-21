import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

interface RadioGroupProps {
    label: string;
    id: string;
    defaultValue: string;
    radioButtonItems: {
        value: string;
        label: string;
    }[];
    handleChangeFunction: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

/*
    <StyledGroupRadiobox
        label='test'
        id='test'
        defaultValue='test'
        radioButtonItems={[
            {
                value: 'test',
                label: 'test',
            },
            {
                value: 'test2',
                label: 'test2',
            },
        ]}
        handleChangeFunction={(e) => { console.log(e.target.value) }}
    />
*/

export default function StyledGroupRadiobox({label, id, defaultValue, radioButtonItems, handleChangeFunction}: RadioGroupProps) {
    return (
        <FormControl>
            <FormLabel id={id}>{label}</FormLabel>
            <RadioGroup
                aria-labelledby={id}
                defaultValue={defaultValue}
                name={"radio-group-" + id}
                onChange={handleChangeFunction}
            >
                {radioButtonItems.map((radioButtonItem, index) => {
                    return (
                        <FormControlLabel
                            key={index}
                            value={radioButtonItem.value}
                            control={<Radio />}
                            label={radioButtonItem.label}
                        />
                    );
                })}
            </RadioGroup>
        </FormControl>
    );
}