import { Box, styled, LinearProgress, Button, Backdrop } from '@mui/material';
import React from 'react';
import "cropperjs/dist/cropper.css";
import { Clear, FileUploadOutlined, InsertDriveFileSharp } from "@mui/icons-material";
import Image from 'next/image';
import StyledButtonIconOnly from '../../../common/buttons/buttonIconOnly';
import { StyledText } from '../../../common/styledText/styledText';
import { StyledUploadStrings } from '../../../common/styledUpload/lang/styledUploadStrings';
import { IconContainerGrey, IconContainerWhite } from '../../../common/iconContainer/iconContainer';
import { AccessibilityContext } from "../../../../store/providers/accessibilityProvider";
import { resizeFile } from '../../../../utility/imageResizer';
import useTranslation from '../../../../utility/useTranslation';


const StyledUploadContainer = styled(Box)`
    display: flex;
    flex-direction: column;
    align-items: center;
`

interface StyledUploadProps {
    file: string,
    setFile: (file: string) => void,
    backgroundImg: string,
}

const bckgCoverImg = "/Images/logo_cover_2x.png";

const StyledLogoUpload = ({file, setFile, backgroundImg}: StyledUploadProps) => {
    const { t } = useTranslation(StyledUploadStrings);
    const { theme, accessibility: { isDark } } = React.useContext(AccessibilityContext);
    const inputFileRef = React.useRef<HTMLInputElement>(null);
    const dropArea = React.useRef<HTMLButtonElement>(null);

    const [highlight, setHighlight] = React.useState(false);
    const [value, setValue] = React.useState(0);
    const [uploading, setUploading] = React.useState(false);
 
    function preventDefaults (e: any) {
        e.preventDefault()
        e.stopPropagation()
    }

    const handleFileInputChange = async (event: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLButtonElement>) => {
        setValue(0);
        setUploading(true);
        let files;

        if (event.type === "change") {
            const target = event.target as HTMLInputElement;
            files = target.files;
        }else if(event.type === "drop") {
            const ev = event as React.DragEvent;
            files = ev.dataTransfer.files;
        }

        if (files && files.length) {
            const file = files[0];
            const resizedFile = await resizeFile(file, 384, 128, "image/png", 100);
            if(typeof resizedFile === "string") setFile(resizedFile);
        }

        setUploading(false);
        setValue(100);
    }

    React.useEffect(() => {
        const uploadFunc = setTimeout(() => {
            if(uploading) {
                if(value < 100) {
                    setValue(value + 1);
                }else{
                    setUploading(false);
                }
            }
        }, 200);

        return () => clearTimeout(uploadFunc);
    }, [uploading, value]);

    return (
        <StyledUploadContainer>
            <Box sx={{
                width: "100%",
                borderRadius: "8px",
                marginBottom: "15px",
                position: "relative",
                backgroundColor: isDark?theme.palette.grey[900]:theme.palette.grey[300],

                '& .cropper-drag-box, & .cropper-bg, & .cropper-canvas': {
                    borderRadius: "8px",
                }
            }}>
                <Box sx={{
                    position: "relative",
                    height: "320px",
                    borderRadius: "8px",
                    '& img': {borderRadius: "8px"}
                }}>
                    {backgroundImg && backgroundImg.length > 0?
                    <Box sx={{position: "relative", height: "320px"}}>
                        <Box sx={{ zIndex: 1 }}>
                            <Image
                                src={backgroundImg}
                                alt="background image"
                                style={{
                                    objectFit: "contain",
                                    objectPosition: "center",
                                }}
                                fill
                                sizes='100%'
                            />
                        </Box>
                        <Backdrop sx={{ position: "absolute", height: "100%", width: "100%", zIndex: 0, backgroundColor: "rgba(0,0,0,0.15)" }} open={true} />
                    </Box>
                    :
                    null
                    }
                    <Box
                        sx={{
                            position: "relative"
                        }}
                    >
                        <Image
                            src={bckgCoverImg}
                            alt="background image"
                            style={{
                                objectFit: "contain",
                                objectPosition: "center",
                            }}
                            fill
                            sizes='100%'
                        />
                    </Box>
                    {file && file.length > 0?
                        <Box sx={{
                            position: "absolute",
                            bottom: "119px",
                            left: "42px",
                            lineHeight: 0,
                            height: "64px",
                            width: "192px",
                        }}>
                            <Image
                                src={file}
                                alt="logo image"
                                width={192}
                                height={64}
                                style={{
                                    objectFit: "contain",
                                    objectPosition: "left bottom",
                                }}
                            />
                        </Box>
                    :null}
                </Box>
            </Box>
            <Box sx={{
                margin: "15px 0",
                backgroundColor: isDark?theme.palette.grey[900]:theme.palette.grey[200],
                minHeight: "44px",
                display: "flex",
                alignItems: "center",
                width: "100%",
                borderRadius: "8px"
            }}>
                <Box sx={{
                    minHeight: "32px",
                    minWidth: "32px",
                    backgroundColor: theme.palette.background.paper,
                    borderRadius: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginLeft: "6px",
                    marginRight: "26px",
                }}>
                    <IconContainerGrey sx={{ minWidth: "24px", minHeight: "24px", fontSize: "24px" }}>
                        <InsertDriveFileSharp />
                    </IconContainerGrey>
                </Box>
                <StyledText sx={{ marginRight: "26px" }} text={(value !==0)?(value!==100)?t("uploading"):t("uploaded"):""} />
                <Box sx={{ flexGrow: 1 }} >
                    <LinearProgress sx={{ marginRight: "20px", borderRadius: "2px" }} variant="determinate" value={value} />
                </Box>
                <Box sx={{ marginRight: "9px" }}>
                    <StyledButtonIconOnly
                        buttonFunction={() => {
                            setValue(0);
                            setFile("");
                            setUploading(false);
                        }}
                        sx={{
                            backgroundColor: theme.palette.grey[500],
                            borderRadius: "50%",

                            '&:hover': {
                                backgroundColor: isDark?theme.palette.grey[400]:theme.palette.grey[700],
                            }
                        }}
                        icon={
                        <IconContainerWhite sx={{ fontSize: "16px" }}>
                            <Clear />
                        </IconContainerWhite>
                    } />
                </Box>
            </Box>
            <Button
                sx={{
                    minWidth: 0,
                    height: "125px",
                    width: "100%",
                    backgroundColor: highlight ?(isDark?theme.palette.grey[800]:theme.palette.grey[300]):(isDark?theme.palette.grey[900]:theme.palette.grey[200]),
                    borderRadius: "8px",
                    padding: "6px",

                    '&:hover': {
                        backgroundColor: isDark?theme.palette.grey[800]:theme.palette.grey[300],
                    },
                }}
                onClick={() => {
                    inputFileRef.current?.click();
                }}
                onDragEnter={(event) => {
                    preventDefaults(event);
                }}
                onDragLeave={(event) => {
                    preventDefaults(event);
                    setHighlight(false);
                }}
                onDragOver={(event) => {
                    preventDefaults(event);
                    setHighlight(true);
                }}
                onDrop={(event) => {
                    preventDefaults(event);
                    setHighlight(false);

                    handleFileInputChange(event);
                }}
                ref={dropArea}
            >
                <Box className="borderBox" sx={{
                    height: "100%",
                    width: "100%",
                    border: "2px dashed "+ (highlight ? theme.palette.primary.main : theme.palette.grey[500]),
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "8px",
                }}>
                    <IconContainerGrey sx={{ marginBottom: "15px", fontSize: "24px", lineHeight: "24px", padding: "10px", borderRadius: "50%", backgroundColor: theme.palette.background.paper }}>
                        <FileUploadOutlined />
                    </IconContainerGrey>
                    <StyledText text={t("dropPNGorJPGhere")} />
                    <input ref={inputFileRef} onChange={handleFileInputChange} accept="image/png, image/jpeg" type="file" style={{ display: "none" }} />
                </Box>
            </Button>
        </StyledUploadContainer>
    )
}

export default StyledLogoUpload;