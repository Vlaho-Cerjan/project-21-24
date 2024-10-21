import { ReactElement } from "react";
import ActionArtistComponent from "../../../../src/components/content/action/artist/actionArtistComponent";
import Layout from "../../../../src/components/layout/layout";

const EditArtist = () => {
    return (
            <ActionArtistComponent action={"edit"} />
        );
    }

export default EditArtist;

EditArtist.getLayout = function getLayout(page: ReactElement) {

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

