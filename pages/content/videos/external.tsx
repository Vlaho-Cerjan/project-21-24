import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import { ReactElement } from "react";
import ExternalVideosComponent from "../../../src/components/content/external/externalVideosComponent";
import Layout from "../../../src/components/layout/layout";

interface ExternalVideosProps {
    searchResult: string | null;
    setSearchLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const ExternalVideos = ({ searchResult, setSearchLoading }: ExternalVideosProps) => {
    return (
            <ExternalVideosComponent searchResult={searchResult} setSearchLoading={setSearchLoading}  />
        );
    }

export default ExternalVideos;

ExternalVideos.getLayout = function getLayout(page: ReactElement) {

    return (
        <Layout
            title={"projectTitle"}
            searchTitle={"searchVideos"}
            buttonIcon={<FileUploadOutlinedIcon />}
            buttonTitle={"uploadVideo"}
            buttonHref={"/content/videos/external/add"}
        >
            {page}
        </Layout>
    )
}

