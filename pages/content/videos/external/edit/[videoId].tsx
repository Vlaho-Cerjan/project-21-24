import { ReactElement } from "react";
import ActionVideoComponent from "../../../../../src/components/content/action/video/actionVideoComponent";
import Layout from "../../../../../src/components/layout/layout";

const EditMusicVideo = () => {
    return (
            <ActionVideoComponent action={"edit"} videoType={"external"} />
        );
    }

export default EditMusicVideo;

EditMusicVideo.getLayout = function getLayout(page: ReactElement) {

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

