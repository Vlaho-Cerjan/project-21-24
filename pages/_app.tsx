import ProgressBar from "@badrap/bar-of-progress";
import { CacheProvider, EmotionCache } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import { NextPage } from "next";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { AppProps } from "next/app";
import { Roboto_Mono } from 'next/font/google';
import { Router } from "next/router";
import { SnackbarProvider } from 'notistack';
import { ReactElement, ReactNode } from "react";
import { Provider } from "react-redux";
import { SWRConfig } from "swr";
import fetchJson from "../src/lib/fetchJson";
import store from "../src/store";
import { AccessibilityProvider } from "../src/store/providers/accessibilityProvider";
import { LoadingProvider } from "../src/store/providers/loadingProvider";
import { LockProvider } from "../src/store/providers/lockProvider";
import '../src/styles/global.scss';
import createEmotionCache from "../src/utility/createEmotionCache";

const roboto = Roboto_Mono({
  subsets: ['latin'],
  weight: ["100", "300", "400", "500", "600", "700"],
  display: 'swap',
});

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps<{ session: Session; }> & {
  Component: NextPageWithLayout,
  emotionCache?: EmotionCache;
}

const clientSideEmotionCache = createEmotionCache();

const progress = new ProgressBar(
  {
    size: 4,
    color: "#1665d8"
  }
);

const MyApp = (props: AppPropsWithLayout) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps: { session, ...pageProps }, } = props;
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page: any) => page);

  Router.events.on("routeChangeStart", () => {
    progress.start();
  });
  Router.events.on("routeChangeComplete", () => {
    progress.finish();
  });
  Router.events.on("routeChangeError", () => {
    progress.finish();
  });

  return (
    <main>
      <style jsx global>{`
        html {
          font-family: ${roboto.style.fontFamily};
        }
      `}</style>
      <SWRConfig
        value={{
          fetcher: fetchJson,
          onError: (err) => {
            console.error(err);
          },
        }}
      >
        <SessionProvider session={session}>
          <Provider store={store}>
            <LoadingProvider>
              <AccessibilityProvider>
                <CacheProvider value={emotionCache}>
                  <LockProvider>
                    <SnackbarProvider maxSnack={5} anchorOrigin={{ horizontal: "right", vertical: "top" }} variant="success" >
                      <CssBaseline />
                      {getLayout(<Component {...pageProps} />)}
                    </SnackbarProvider>
                  </LockProvider>
                </CacheProvider>
              </AccessibilityProvider>
            </LoadingProvider>
          </Provider>
        </SessionProvider>
      </SWRConfig>
    </main>
  );
}

export default MyApp;
