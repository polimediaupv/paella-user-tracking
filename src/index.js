
import GoogleAnalyticsUserTrackingData from './plugins/es.upv.paella.analytics.userTrackingDataPlugin';
import DebugUserTrackingData from './plugins/es.upv.paella.debug.userTrackingDataPlugin';
import UserEventTracker from './plugins/es.upv.paella.userEventTracker';
import matomoTrackingData from './plugins/org.opencast.paella.opencast.matomoTrackingDataPlugin';

export default function getUserTrackingPluginsContext() {
    return require.context("./plugins", true, /\.js/)
}

export const GoogleAnalyticsUserTrackingDataPlugin = GoogleAnalyticsUserTrackingData;
export const DebugUserTrackingDataPlugin = DebugUserTrackingData;
export const UserEventTrackerPlugin = UserEventTracker;
export const matomoTrackingDataPlugin = matomoTrackingData;
