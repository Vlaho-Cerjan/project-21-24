import AddIcon from '@mui/icons-material/Add';
import router from 'next/router';
import { ReactElement, useEffect } from "react";
import Layout from "../src/components/layout/layout";

export default function Dashboard() {
  useEffect(() => {
    if(router) router.push("/project-player/layout");
  }, [])

  return (
      <>
        LoggedIn
      </>
  );
}

Dashboard.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout
      title={"projectTitle"}
      searchTitle={"Search for..."}
      buttonIcon={<AddIcon />}
      buttonTitle={"Button"}
      buttonHref={"Upload..."}
      >
      {page}
    </Layout>
  )
}