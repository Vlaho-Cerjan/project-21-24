import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import React, { ReactElement } from "react";
import MusicVideosComponent from "../../../src/components/content/music/musicVideosComponent";
import Layout from "../../../src/components/layout/layout";

interface MusicVideosProps {
    searchResult: string | null;
    setSearchLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const MusicVideos = ({ searchResult, setSearchLoading }: MusicVideosProps) => {

    return (
            <MusicVideosComponent searchResult={searchResult} setSearchLoading={setSearchLoading} />
        );
    }

export default MusicVideos;

MusicVideos.getLayout = function getLayout(page: ReactElement) {

    return (
        <Layout
            title={"projectTitle"}
            searchTitle={"searchVideos"}
            buttonIcon={<FileUploadOutlinedIcon />}
            buttonTitle={"uploadVideo"}
            buttonHref={"/content/videos/music/add"}
        >
            {page}
        </Layout>
    )
}

