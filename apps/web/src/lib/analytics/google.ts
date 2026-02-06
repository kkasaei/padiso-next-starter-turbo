'use client';

import { env } from '@/env';
import { isProductionDomain } from '@/lib/analytics-domain';
import type { AnalyticsProvider } from './types';

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (command: string, ...args: unknown[]) => void;
  }
}

type GtagCommand = 'config' | 'event' | 'set' | 'js' | 'consent';

class GtagAnalyticsProvider implements AnalyticsProvider {
  private isInitialized = false;

  public async trackPageView(path: string): Promise<void> {
    if (typeof window === 'undefined') {
      return;
    }

    if (!isProductionDomain()) {
      return;
    }

    if (env.NEXT_PUBLIC_ANALYTICS_GA_DISABLE_PAGE_VIEWS_TRACKING) {
      return;
    }

    if (!this.isInitialized) {
      try {
        await this.initialize();
      } catch (error) {
        console.error('[Google Analytics] Failed to initialize:', error);
        return;
      }
    }
    if (!this.isInitialized) {
      return;
    }

    const measurementId = env.NEXT_PUBLIC_ANALYTICS_GA_MEASUREMENT_ID;
    if (!measurementId) {
      console.error('GA Measurement ID missing for trackPageView');
      return;
    }

    const newUrl = new URL(path, window.location.href).href;

    this.gtag('event', 'page_view', {
      page_location: newUrl,
      page_path: path,
    });
  }

  public async trackEvent(
    eventName: string,
    eventProperties: Record<
      string,
      string | string[] | number | boolean
    > = {}
  ): Promise<void> {
    if (typeof window === 'undefined') {
      return;
    }

    if (!isProductionDomain()) {
      return;
    }

    if (!this.isInitialized) {
      await this.initialize();
    }
    if (!this.isInitialized) {
      return;
    }

    const processedProperties: Record<string, string | number | boolean> = {};
    Object.entries(eventProperties).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        processedProperties[key] = value.join(',');
      } else if (value !== null && value !== undefined) {
        processedProperties[key] = value as string | number | boolean;
      }
    });

    this.gtag('event', eventName, processedProperties);
  }

  public async identify(
    userId: string,
    traits: Record<string, string | number | boolean> = {}
  ): Promise<void> {
    if (typeof window === 'undefined') {
      return;
    }

    if (!isProductionDomain()) {
      return;
    }

    if (!this.isInitialized) {
      await this.initialize();
    }
    if (!this.isInitialized) {
      return;
    }

    const measurementId = env.NEXT_PUBLIC_ANALYTICS_GA_MEASUREMENT_ID;
    if (!measurementId) {
      console.error('GA Measurement ID missing for identify');
      return;
    }

    this.gtag('config', measurementId, {
      user_id: userId,
    });

    if (Object.keys(traits).length > 0) {
      this.gtag('set', 'user_properties', traits);
    }
  }

  private async initialize(): Promise<void> {
    if (this.isInitialized || typeof window === 'undefined') {
      return Promise.resolve();
    }

    if (!isProductionDomain()) {
      console.log(
        '[Google Analytics] Skipping initialization - not on production domain (searchfit.ai)'
      );
      return Promise.resolve();
    }

    const measurementId = env.NEXT_PUBLIC_ANALYTICS_GA_MEASUREMENT_ID;
    if (!measurementId) {
      throw new Error(
        'Measurement ID is not set. Please set the environment variable NEXT_PUBLIC_ANALYTICS_GA_MEASUREMENT_ID.'
      );
    }

    // If gtag was already loaded by the GoogleAnalytics component (via next/script),
    // just mark as initialized — no need to inject a duplicate script
    if (window.gtag) {
      this.isInitialized = true;
      return Promise.resolve();
    }

    return this.createGtagScript(measurementId);
  }

  private createGtagScript(measurementId: string): Promise<void> {
    return new Promise((resolve) => {
      if (typeof window === 'undefined' || typeof document === 'undefined') {
        resolve();
        return;
      }

      window.dataLayer = window.dataLayer || [];
      function gtag(...args: unknown[]) {
        window.dataLayer!.push(args);
      }
      window.gtag = gtag;

      gtag('js', new Date());
      gtag('config', measurementId, {
        send_page_view: false,
      });

      const script = document.createElement('script');
      script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
      script.async = true;

      script.onload = () => {
        this.isInitialized = true;
        resolve();
      };

      script.onerror = (error) => {
        console.error(
          `Failed to load Google Analytics script for ${measurementId}:`,
          error
        );
        resolve();
      };

      document.head.appendChild(script);
    });
  }

  private gtag(command: GtagCommand, ...args: unknown[]) {
    if (typeof window === 'undefined') {
      return;
    }

    if (window.gtag) {
      window.gtag(command, ...args);
      return;
    }

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push([command, ...args]);
  }
}

export const gtagAnalyticsProvider = new GtagAnalyticsProvider();
export default gtagAnalyticsProvider;
