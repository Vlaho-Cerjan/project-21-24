import { configStore } from '@/store';
import { AccessibilityProvider } from '@/store/providers/accessibilityProvider';
import { LoadingProvider } from '@/store/providers/loadingProvider';
import { LockProvider } from '@/store/providers/lockProvider';
import createEmotionCache from '@/utility/createEmotionCache';
import { CacheProvider } from '@emotion/react';
import { loadEnvConfig } from '@next/env';
import { render as renderComponent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import dotenv from 'dotenv';
import { SessionContext, SessionProvider } from 'next-auth/react';
import { SnackbarProvider } from 'notistack';
import React, { ReactElement } from 'react';
import { Provider } from 'react-redux';
import { afterAll, afterEach, beforeAll, vi } from 'vitest';
import createFetchMock from 'vitest-fetch-mock';
import { server } from '../src/mocks/server';

// eslint-disable-next-line import/no-anonymous-default-export
export default async () => {
  const projectDir = process.cwd();
  loadEnvConfig(projectDir);
};

dotenv.config({
  path: '.env.local',
});

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const session = React.useContext(SessionContext);

  if (session) {

    session.data = {
      "user": {
        "id": "6e9b4ec0-d5fd-11eb-bd87-3577ac9d31f3",
        "email": "vlaho+cms@project.tv",
        "first_name": "Vlaho",
        "last_name": "Cerjan",
        "job_title": "Senior Web Developer",
        "token": "I4kGiKdzgPuFliM5FCq38YEUku2sv90GMXwSkLIfLV+PoW9QJXagxC2ovFXi0p47Ve5uY6LpqRrkGpQG39Ou2w==",
        "image": "0",
        "created_at": "2021-06-25T21:36:42+00:00",
        "updated_at": "2023-06-20T17:28:26+00:00",
        "roles": [
          "kam",
          "admin"
        ]
      },
      // new date + 3 hours
      "expires": (new Date().getTime() + 10800000).toString(),
    }

  }

  const store = configStore;

  const clientSideEmotionCache = createEmotionCache();

  return (
    <SessionProvider session={session?.data}>
      <Provider store={store}>
        <LoadingProvider>
          <AccessibilityProvider>
            <CacheProvider value={clientSideEmotionCache}>
              <LockProvider>
                <SnackbarProvider maxSnack={5} anchorOrigin={{ horizontal: "right", vertical: "top" }} variant="success" >
                  {children}
                </SnackbarProvider>
              </LockProvider>
            </CacheProvider>
          </AccessibilityProvider>
        </LoadingProvider>
      </Provider>
    </SessionProvider>
  );
};


type RenderOptions = Parameters<typeof renderComponent>[1];

export * from '@testing-library/react';

export const render = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) => {
  return {
    ...renderComponent(ui, { wrapper: AllTheProviders, ...options }),
    user: userEvent.setup(),
  };
};

const fetchMocker = createFetchMock(vi);

// sets globalThis.fetch and globalThis.fetchMock to our mocked version
fetchMocker.enableMocks();

// Establish API mocking before all tests.
beforeAll(() => server.listen())

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers())

// Clean up after the tests are finished.
afterAll(() => server.close())

