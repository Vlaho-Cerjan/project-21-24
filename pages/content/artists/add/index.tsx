import { ReactElement } from "react";
import ActionArtistComponent from '../../../../src/components/content/action/artist/actionArtistComponent';
import Layout from "../../../../src/components/layout/layout";

const AddArtist = () => {
    return (
            <ActionArtistComponent action={"add"} />
        );
    }

export default AddArtist;

AddArtist.getLayout = function getLayout(page: ReactElement) {

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

