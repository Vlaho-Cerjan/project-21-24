import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import React, { ReactElement } from "react";
import ArtistsComponent from "../../../src/components/content/artists/artistsComponent";
import Layout from "../../../src/components/layout/layout";

interface ArtistsProps {
    searchResult: string | null;
    setSearchLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const Artists = ({ searchResult, setSearchLoading }: ArtistsProps) => {

    return (
            <ArtistsComponent searchResult={searchResult} setSearchLoading={setSearchLoading} />
        );
    }

export default Artists;

Artists.getLayout = function getLayout(page: ReactElement) {

    return (
        <Layout
            title={"projectTitle"}
            searchTitle={"searchArtists"}
            buttonIcon={<FileUploadOutlinedIcon />}
            buttonTitle={"addANewArtist"}
            buttonHref={"/content/artists/add"}
        >
            {page}
        </Layout>
    )
}

