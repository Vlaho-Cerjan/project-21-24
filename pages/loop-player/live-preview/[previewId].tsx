import { ReactElement } from "react";
import Layout from "../../../src/components/layout/layout";
import LivePreviewComponent from "../../../src/components/project-player/livePreview/livePreviewComponent";


const LivePreview = () => {

    return (
        <LivePreviewComponent />
    );
}

export default LivePreview;

LivePreview.getLayout = function getLayout(page: ReactElement) {
    return (
        <Layout
            title={"projectTitle"}
            noButton={true}
            noSearch={true}
        >
            {page}
        </Layout>
    )
}