export const MESSAGES = {
  FIREBASE: {
    APP_NOT_INITIALIZED: "Firebase app not initialized.",
  },
  FIRESTORE: {
    ADD_FAILED: "Failed to add document.",
    UPDATE_FAILED: "Failed to update document.",
    DELETE_FAILED: "Failed to delete document.",
    GET_FAILED: "Failed to get document.",
  },
  REALTIME: {
    ADD_FAILED: "Failed to add data.",
    UPDATE_FAILED: "Failed to update data.",
    DELETE_FAILED: "Failed to delete data.",
    GET_FAILED: "Failed to get data.",
  },
  STORAGE: {
    UPLOAD_FAILED: "Failed to upload file.",
    UPDATE_FAILED: "Failed to update file.",
    GET_FAILED: "Failed to get file.",
    DELETE_FAILED: "Failed to delete file.",
  },
  AUTH: {
    SIGNIN_FAILED: (provider: string) => `Failed to sign up with ${provider}.`,
    SIGNUP_FAILED: "Failed to sign up.",
    SIGNOUT_FAILED: "Failed to sign out.",
    DELETE_FAILED: "Failed to delete user.",
    UPDATE_FAILED: "Failed to update user.",
    INVALID_PROVIDER: (provider: string) => `Invalid provider: ${provider}.`,
    INVALID_SCOPE: (scope: string) => `Invalid scope: ${scope}.`,
  },
  ANALYTICS: {
    EVENT_NAME_REQUIRED: "Event name is required.",
    USER_ID_REQUIRED: "User ID is required.",
    USER_PROPERTIES_REQUIRED: "User properties are required.",
  },
};
