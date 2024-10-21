import { Box } from "@mui/material";
import { RowItem } from '../../../../interfaces/projectPlayer/rowItem';
import { RowBgGray, RowBgWhite } from "../../../common/rowBackgrounds/rowBackgrounds";
import { TextMedium16 } from "../../../common/styledText/styledText";
import { ContentBox, ItemContainerBox } from '../../layoutPage/styledComponents/rowsStyledComponents';
import PreviewRowItems from "./previewRowItems/previewRowItems";

interface PreviewRowProps {
    rowsProp: {
        id: string;
        title: string;
        items: RowItem[];
    }[];
}

const PreviewRows = ({ rowsProp }: PreviewRowProps) => {

    const rows = rowsProp;

    return (
        <Box>
            {rows.map((item, index) => {
                return (
                    !(index % 2) ?
                        <RowBgWhite
                            key={"previewItem_" + index}
                        >
                            <ItemContainerBox>
                                <ContentBox>
                                    <TextMedium16
                                        containerSx={{
                                            lineHeight: "19px",
                                            display: "flex"
                                        }}
                                        text={item.title}
                                    />
                                </ContentBox>
                                <PreviewRowItems slideItems={item.items} index={index} />
                            </ItemContainerBox>
                        </RowBgWhite>
                        :
                        <RowBgGray
                            key={"previewItem_" + index}
                        >
                            <ItemContainerBox>
                                <ContentBox>
                                    <TextMedium16
                                        containerSx={{
                                            lineHeight: "19px",
                                            display: "flex"
                                        }}
                                        text={item.title}
                                    />
                                </ContentBox>
                                <PreviewRowItems slideItems={item.items} index={index} />
                            </ItemContainerBox>
                        </RowBgGray>
                )
            }
            )}
        </Box>
    )
}

export default PreviewRows;