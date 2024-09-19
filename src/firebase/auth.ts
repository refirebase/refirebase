import type { FirebaseApp } from "firebase/app";

import {
  type Auth,
  EmailAuthProvider,
  FacebookAuthProvider,
  GithubAuthProvider,
  GoogleAuthProvider,
  TwitterAuthProvider,
  type User,
  type UserCredential,
  getAuth,
  onAuthStateChanged,
  onIdTokenChanged,
  signInWithPopup,
} from "firebase/auth";

import { MESSAGES } from "../config/messages";

type Provider = "google" | "github" | "twitter" | "facebook";

export class FirebaseAuth {
  private readonly auth: Auth;

  constructor(app: FirebaseApp) {
    if (!app) {
      throw new Error(MESSAGES.FIREBASE.APP_NOT_INITIALIZED);
    }

    this.auth = getAuth(app);
  }

  /**
   * Sign in with a third-party provider.
   *
   * @param provider The provider to sign in with.
   * @param options The options for signing in with the provider.
   *
   * @returns A promise that resolves with the user credential or null if the sign-in fails.
   */
  async handleProviderSignIn(
    provider: Provider,
    options?: { scopes?: string[] }
  ): Promise<UserCredential | null> {
    let authProvider:
      | GoogleAuthProvider
      | GithubAuthProvider
      | TwitterAuthProvider
      | FacebookAuthProvider
      | null = null;

    switch (provider) {
      case "google":
        authProvider = new GoogleAuthProvider();
        break;
      case "github":
        authProvider = new GithubAuthProvider();
        break;
      case "twitter":
        authProvider = new TwitterAuthProvider();
        break;
      case "facebook":
        authProvider = new FacebookAuthProvider();
        break;
      default:
        return null;
    }

    const validProviders = [
      GoogleAuthProvider,
      GithubAuthProvider,
      TwitterAuthProvider,
      FacebookAuthProvider,
    ];

    if (
      !authProvider ||
      !validProviders.some((provider) => authProvider instanceof provider)
    ) {
      throw new Error(MESSAGES.AUTH.INVALID_PROVIDER(provider));
    }

    if (options) {
      if (options.scopes) {
        const { scopes } = options;

        for (const scope of scopes) {
          if (typeof scope !== "string") {
            throw new Error(MESSAGES.AUTH.INVALID_SCOPE(scope));
          }
        }
      }
    }

    try {
      return await signInWithPopup(this.auth, authProvider);
    } catch (error) {
      console.error(MESSAGES.AUTH.SIGNIN_FAILED(provider), error);
      return null;
    }
  }

  /**
   * Sign in with an email and password.
   *
   * @param email The user's email address.
   * @param password The user's password.
   *
   * @returns A promise that resolves with the user credential or null if the sign-in fails.
   */
  async handleEmailSignIn(
    email: string,
    password: string
  ): Promise<UserCredential | null> {
    try {
      return await signInWithPopup(
        this.auth,
        EmailAuthProvider.credential(email, password)
      );
    } catch (error) {
      console.error(MESSAGES.AUTH.SIGNIN_FAILED("email"), error);
      return null;
    }
  }

  /**
   * Sign out the current user.
   * @returns A promise that resolves when the user is signed out.
   */
  handleSignOut(): void {
    this.auth.signOut();
  }

  /**
   * Get the current user.
   * @returns The current user or null if the user is not signed in.
   */
  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }

  /**
   * Get the current user's access token.
   * @returns The user's access token or null if the user is not signed in.
   */
  getAccessToken(): Promise<string | null> {
    return this.auth.currentUser?.getIdToken() ?? Promise.resolve(null);
  }

  /**
   * Listen for changes to the user's sign-in state.
   * @param callback A function that takes the current user as an argument.
   */
  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(this.auth, callback);
  }

  /**
   * Listen for changes to the user's ID token.
   * @param callback A function that takes the current user as an argument.
   */
  onIdTokenChanged(callback: (user: User | null) => void): () => void {
    return onIdTokenChanged(this.auth, callback);
  }
}
