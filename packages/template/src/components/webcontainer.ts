import { useAuth } from './setup';
import { auth, WebContainer } from '@webcontainer/api';
import { TutorialRunner } from '@tutorialkit/runtime';

interface WebContainerContext {
  useAuth: boolean;
  loggedIn: () => Promise<void>;
  loaded: boolean;
}

export let webcontainer: Promise<WebContainer> = new Promise(() => {});

if (!import.meta.env.SSR) {
  webcontainer = Promise.resolve(useAuth ? auth.loggedIn() : null).then(() =>
    WebContainer.boot({ workdirName: 'tutorial' }),
  );

  webcontainer.then(() => {
    webcontainerContext.loaded = true;
  });
}

export const tutorialRunner = new TutorialRunner(webcontainer, useAuth);

export async function login() {
  auth.startAuthFlow({ popup: true });

  await auth.loggedIn();
}

export function logout() {
  auth.logout({ ignoreRevokeError: true });
}

export const webcontainerContext: WebContainerContext = {
  useAuth,
  loggedIn: () => auth.loggedIn(),
  loaded: false,
};
