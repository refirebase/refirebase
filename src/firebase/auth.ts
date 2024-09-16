import {
  type Auth,
  EmailAuthProvider,
  FacebookAuthProvider,
  GithubAuthProvider,
  GoogleAuthProvider,
  TwitterAuthProvider,
  type UserCredential,
  getAuth,
  onAuthStateChanged,
  onIdTokenChanged,
  signInWithPopup,
} from "firebase/auth";

type Provider = "google" | "github" | "twitter" | "facebook" | "email";

export class FirebaseAuth {
  auth: Auth;

  constructor() {
    this.auth = getAuth();
  }

  /**
   * Sign in with a third-party provider.
   * @param provider The provider to sign in with.
   * @returns A promise that resolves with the user credential or null if the sign-in fails.
   */
  async handleProviderSignIn(
    provider: Provider
  ): Promise<UserCredential | null> {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    let authProvider: any;

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
      case "email":
        authProvider = new EmailAuthProvider();
        break;
      default:
        return null;
    }

    if (!authProvider) {
      throw new Error(`Invalid provider: ${provider}`);
    }

    try {
      return await signInWithPopup(this.auth, authProvider);
    } catch (error) {
      console.error(`Error signing in with ${provider}:`, error);
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
  getCurrentUser(): unknown | null {
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
  onAuthStateChanged(callback: (user: unknown | null) => void): () => void {
    return onAuthStateChanged(this.auth, callback);
  }

  /**
   * Listen for changes to the user's ID token.
   * @param callback A function that takes the current user as an argument.
   */
  onIdTokenChanged(callback: (user: unknown | null) => void): () => void {
    return onIdTokenChanged(this.auth, callback);
  }
}
