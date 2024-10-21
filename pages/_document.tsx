import createEmotionServer from '@emotion/server/create-instance';
import Document, { Head, Html, Main, NextScript } from 'next/document';
import * as React from 'react';
import createEmotionCache from '../src/utility/createEmotionCache';

export default class MyDocument extends Document {
    render() {
        return (
        <Html lang="en">
            <Head />
            <body>
            <Main />
            <NextScript />
            </body>
        </Html>
        );
    }
}

// `getInitialProps` belongs to `_document` (instead of `_app`),
// it's compatible with static-site generation (SSG).
MyDocument.getInitialProps = async (ctx) => {
    // Resolution order
    //
    // On the server:
    // 1. src.getInitialProps
    // 2. page.getInitialProps
    // 3. document.getInitialProps
    // 4. src.render
    // 5. page.render
    // 6. document.render
    //
    // On the server with error:
    // 1. document.getInitialProps
    // 2. src.render
    // 3. page.render
    // 4. document.render
    //
    // On the client
    // 1. src.getInitialProps
    // 2. page.getInitialProps
    // 3. src.render
    // 4. page.render

    const originalRenderPage = ctx.renderPage;

    // You can consider sharing the same emotion cache between all the SSR requests to speed up performance.
    // However, be aware that it can have global side effects.
    const cache = createEmotionCache();
    const { extractCriticalToChunks } = createEmotionServer(cache);

    /* eslint-disable */
    ctx.renderPage = () =>
        originalRenderPage({
        enhanceApp: (App: any) => (props: any) =>
            <App emotionCache={cache} {...props} />,
        });
    /* eslint-enable */

    const initialProps = await Document.getInitialProps(ctx);
    // This is important. It prevents emotion to render invalid HTML.
    // See https://github.com/mui-org/material-ui/issues/26561#issuecomment-855286153
    const emotionStyles = extractCriticalToChunks(initialProps.html);
    const emotionStyleTags = emotionStyles.styles.map((style: { key: React.Key | null | undefined; ids: any[]; css: any; }) => (
        <style
        data-emotion={`${style.key} ${style.ids.join(' ')}`}
        key={style.key}
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: style.css }}
        />
    ));

    return {
        ...initialProps,
        // Styles fragment is rendered after the src and page rendering finish.
        styles: [
        ...React.Children.toArray(initialProps.styles),
        ...emotionStyleTags,
        ],
    };
};