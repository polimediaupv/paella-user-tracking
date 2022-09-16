
import GoogleAnalyticsUserTrackingData from './plugins/es.upv.paella.analytics.userTrackingDataPlugin';
import MatomoUserTrackingData from './plugins/es.upv.paella.matomo.userTrackingDataPlugin';
import DebugUserTrackingData from './plugins/es.upv.paella.debug.userTrackingDataPlugin';
import UserEventTracker from './plugins/es.upv.paella.userEventTracker';

export default function getUserTrackingPluginsContext() {
    return require.context("./plugins", true, /\.js/)
}

export const GoogleAnalyticsUserTrackingDataPlugin = GoogleAnalyticsUserTrackingData;
export const MatomoUserTrackingDataPlugin = MatomoUserTrackingData;
export const DebugUserTrackingDataPlugin = DebugUserTrackingData;
export const UserEventTrackerPlugin = UserEventTracker;
