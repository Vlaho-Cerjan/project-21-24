
import { ReactElement } from "react";
import Layout from "../../../../src/components/layout/layout";
import ActionPlaylistComponent from "../../../../src/components/project-player/action/playlist/actionPlaylistComponent";

const EditPlaylist = () => {
    return (
            <ActionPlaylistComponent action={"edit"} />
        );
    }

export default EditPlaylist;

EditPlaylist.getLayout = function getLayout(page: ReactElement) {

    return (
        <Layout
            title={"projectTitle"}
            noSearch={true}
            noButton={true}
        >
            {page}
        </Layout>
    )
}

