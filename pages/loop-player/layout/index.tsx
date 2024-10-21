import { ReactElement } from "react";
import Layout from "../../../src/components/layout/layout";
import LayoutPageComponent from "../../../src/components/project-player/layoutPage/layoutPageComponent";

const LayoutList = () => {

    return (
        <LayoutPageComponent />
    );
}

export default LayoutList;

LayoutList.getLayout = function getLayout(page: ReactElement) {
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