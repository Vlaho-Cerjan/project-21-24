import { ReactElement } from "react";
import Layout from "../../../src/components/layout/layout";
import EditLayoutComponent from '../../../src/components/project-player/layoutPage/editLayout/editLayout';


const EditLayout = () => {

    return (
        <EditLayoutComponent />
    );
}

export default EditLayout;

EditLayout.getLayout = function getLayout(page: ReactElement) {
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