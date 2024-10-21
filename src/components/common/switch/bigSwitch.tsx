import { styled, Switch } from "@mui/material";

export const BigSwitch = styled(Switch)(({ theme }) => ({
  width: 100,
  height: 66,
  padding: 7,
  '& .MuiSwitch-switchBase': {
    margin: 1,
    padding: 0,
    transform: 'translate(7px, 7px)',
    '&.Mui-checked': {
      transform: 'translate(42px, 7px)',
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.primary.light,
      },
    },
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: theme.palette.primary.dark,
    width: 48,
    height: 48,
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
    borderRadius: 24
  },
}));