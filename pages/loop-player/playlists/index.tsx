import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import React, { ReactElement } from "react";
import Layout from '../../../src/components/layout/layout';
import PlaylistsComponent from '../../../src/components/project-player/playlists/playlistsComponent';

interface PlaylistsProps {
    searchResult: string | null;
    setSearchResult: React.Dispatch<React.SetStateAction<string | null>>;
    setSearchLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const Playlists = ({ searchResult, setSearchResult, setSearchLoading }: PlaylistsProps) => {
    return (
            <PlaylistsComponent searchResult={searchResult} setSearchResult={setSearchResult} setSearchLoading={setSearchLoading} />
        );
    }

export default Playlists;

Playlists.getLayout = function getLayout(page: ReactElement) {

    return (
        <Layout
            title={"projectTitle"}
            searchTitle={"searchPlaylists"}
            buttonIcon={<FileUploadOutlinedIcon />}
            buttonTitle={"addNewPlaylist"}
            buttonHref={"/project-player/playlists/add"}
        >
            {page}
        </Layout>
    )
}

