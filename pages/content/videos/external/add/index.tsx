import { ReactElement } from "react";
import ActionVideoComponent from "../../../../../src/components/content/action/video/actionVideoComponent";
import Layout from "../../../../../src/components/layout/layout";

const AddMusicVideo = () => {
    return (
            <ActionVideoComponent action={"add"} videoType={"external"} />
        );
    }

export default AddMusicVideo;

AddMusicVideo.getLayout = function getLayout(page: ReactElement) {

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

