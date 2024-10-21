import { Backdrop, Box } from '@mui/material';
import { TextBold20, TextMedium16, TextBlack18 } from '../styledText/styledText';
import { ActionPromptContainer, ActionPromptBox, ActionPromptTitle, ActionPromptButton } from "./actionComponents";
import { IconContainerGrey } from '../iconContainer/iconContainer';
import { Close } from '@mui/icons-material';

interface ActionFunctionProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    title: string;
    text: React.ReactElement | string;
    buttonText: string;
    actionFunction: () => void;
    cancelFunction: () => void;
}

const actionPrompt = ({ open, setOpen, title, text, buttonText, actionFunction, cancelFunction }: ActionFunctionProps) => {
    return (
        <ActionPromptContainer sx={{
            display: open ? "flex" : "none",
        }}>
            <ActionPromptBox>
                <ActionPromptTitle>
                    <TextBold20 textProps={{
                        sx: {
                            textTransform: "uppercase",
                        }
                    }} text={title} />
                </ActionPromptTitle>
                {typeof text !== "string" ?
                    <Box
                        sx={{
                            padding: "0 16px 40px"
                        }}
                    >
                        {text}
                    </Box>
                    :
                    <TextMedium16
                        text={text}
                        containerSx={{
                            padding: "0 16px 40px"
                        }}
                        textProps={{
                            sx: {
                                color: "text.secondary",
                            }
                        }}
                    />
                }
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    <ActionPromptButton onClick={actionFunction} variant='contained' fullWidth>
                        <TextBlack18 textProps={{
                            sx: {
                                textTransform: "uppercase"
                            }
                        }} text={buttonText} />
                    </ActionPromptButton>
                </Box>
                <Box
                    sx={{
                        position: "absolute",
                        top: "8px",
                        right: "8px",
                        cursor: "pointer",
                    }}
                >
                    <IconContainerGrey onClick={cancelFunction} className='darker' sx={{ fontSize: "24px" }}>
                        <Close />
                    </IconContainerGrey>
                </Box>
            </ActionPromptBox>
            <Backdrop
                open={open}
                onClick={() => {
                    cancelFunction();
                    if (open) setOpen(false);
                }}
            />
        </ActionPromptContainer>
    )
}

export default actionPrompt;