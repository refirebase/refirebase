import type { FirebaseApp } from "firebase/app";

import {
  type Analytics,
  type AnalyticsCallOptions,
  getAnalytics,
  logEvent,
  setAnalyticsCollectionEnabled,
  setUserId,
  setUserProperties,
} from "firebase/analytics";

import { MESSAGES } from "../config/messages";

export class FirebaseAnalytics {
  private readonly analytics: Analytics;

  constructor(app: FirebaseApp) {
    if (!app) {
      throw new Error(MESSAGES.FIREBASE.APP_NOT_INITIALIZED);
    }

    this.analytics = getAnalytics(app);
  }

  /**
   * Logs an analytics event.
   *
   * @param eventName - The name of the event.
   * @param eventParams - The parameters associated with the event.
   * @param options - The options for logging the event.
   */
  log(
    eventName: string,
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    eventParams?: { [key: string]: any },
    options?: AnalyticsCallOptions
  ): void {
    if (!eventName) {
      throw new Error(MESSAGES.ANALYTICS.EVENT_NAME_REQUIRED);
    }

    logEvent(this.analytics, eventName, eventParams, options);
  }

  /**
   * Toggles whether analytics data collection is enabled or disabled.
   * @param isEnabled - Whether analytics data collection is enabled.
   */
  toggleAnalyticsCollection(isEnabled: boolean): void {
    setAnalyticsCollectionEnabled(this.analytics, isEnabled);
  }

  /**
   * Assigns a user ID to the current user.
   *
   * @param userId - The user ID to assign.
   * @param options - The options for assigning the user ID.
   */
  assignUserId(userId: string, options?: AnalyticsCallOptions): void {
    if (!userId) {
      throw new Error(MESSAGES.ANALYTICS.USER_ID_REQUIRED);
    }

    setUserId(this.analytics, userId, options);
  }

  /**
   * Updates the properties associated with the current user.
   *
   * @param properties - The properties to update.
   * @param options - The options for updating the properties.
   */
  updateUserProperties(
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    properties: { [key: string]: any },
    options?: AnalyticsCallOptions
  ): void {
    if (!properties || Object.keys(properties).length === 0) {
      throw new Error(MESSAGES.ANALYTICS.USER_PROPERTIES_REQUIRED);
    }

    setUserProperties(this.analytics, properties, options);
  }
}
