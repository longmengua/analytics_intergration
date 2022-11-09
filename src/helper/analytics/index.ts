import mixpanel from 'mixpanel-browser';
import ReactGA from 'react-ga';
import { LogService } from '../log';

export enum AnalyticServiceEventEnum {
  clickCgcPassLogin = 'clickCgcPassLogin',
  cgcPassLogin = 'cgcPassLogin',
  connectWallet = 'connectWallet',
  collectionBrowser = 'collectionBrowser',
}

export interface AnalyticServiceEventObj {
  [AnalyticServiceEventEnum.connectWallet]: {
    solanaWallet: string;
    evmWallet: string;
    evmChain: string;
  };
  [AnalyticServiceEventEnum.cgcPassLogin]: {
    account: string;
  };
  [AnalyticServiceEventEnum.collectionBrowser]: {
    slug: string;
    url: string;
  };
}

export class AnalyticsService {
  private static isAnalyticDebug =
    Boolean(process?.env?.NEXT_PUBLIC_ANALYTICS_DEBUG) ?? false;
  private static mixpanel_key = process?.env?.NEXT_PUBLIC_MIXPANEL_KEY ?? '';
  private static ga_key = process?.env?.NEXT_PUBLIC_GOOGLE_ANALYTICS ?? '';

  /**
   * @Note init all third party analytic libraries.
   */
  static init = () => {
    LogService.log('[AnalyticsService] init');
    if (this.mixpanel_key === '') {
      LogService.warn('[AnalyticsService] Missing Mixpanel Key');
    } else {
      mixpanel.init(this.mixpanel_key, { debug: this.isAnalyticDebug });
    }
    if (this.ga_key === '') {
      LogService.warn('[AnalyticsService] Missing Google Analytics key');
    } else {
      ReactGA.initialize(this.ga_key, { debug: this.isAnalyticDebug });
    }
  };

  static event = (
    name: AnalyticServiceEventEnum,
    obj?:
      | AnalyticServiceEventObj['cgcPassLogin']
      | AnalyticServiceEventObj['connectWallet']
      | AnalyticServiceEventObj['collectionBrowser'],
  ) => {
    LogService.log(`[AnalyticsService] event: ${name}`, obj);
    mixpanel.track(name, obj);
    // A max size documented of 150 bytes for Categories
    // 500 bytes for Actions and Labels
    ReactGA.event({
      category: `[category] ${name}`,
      action: `[action] ${name}`,
      label: `[label] ${name}`,
    });
  };

  /**
   * @Note TBD
   */
  static pageView = () => {
    // ReactGA.pageview(window.location.pathname + window.location.search);
  };

  /**
   * @Note TBD
   */
  static modalView = () => {
    // A modal view is often an equivalent to a pageview in our UX,
    // but without a change in URL that would record a standard GA pageview. For example,
    // a 'contact us' modal may be accessible from any page in a site,
    // even if we don't have a standalone 'contact us' page on its own URL. In this scenario,
    // the modalview should be recorded using this function.
    // ReactGA.modalview('/about/contact-us');
  };
}
