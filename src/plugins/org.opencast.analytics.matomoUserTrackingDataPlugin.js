
import { DataPlugin  } from "paella-core";

export default class MatomoAnalyticsUserTrackingDataPlugin extends DataPlugin {
    async load() {
        const siteId = this.config.siteId;
        const server = this.config.server || "auto";
        const heartBeat = this.config.heartBeat;

        if (server && siteId) {
            if (server.substr(-1) != '/') server += '/';
            require([server + "piwik.js"], function(matomo){
                this.player.log.debug("Matomo analytics enabled");
                paella.userTracking.matomotracker = Piwik.getAsyncTracker( server + "piwik.php", siteId );
                paella.userTracking.matomotracker.client_id = thisClass.config.client_id;
                if (heartBeat && heartBeat > 0) paella.userTracking.matomotracker.enableHeartBeatTimer(heartBeat);
                if (Piwik && Piwik.MediaAnalytics) {
                    paella.events.bind(paella.events.videoReady, () => {
                        Piwik.MediaAnalytics.scanForMedia();
                });
            }
            thisClass
        });

    } else {
        this.player.log.debug("No Matomo Site ID found in config file. Disabling Matomo Analytics PlugIn");
    }
}
    
    async write(context, { id }, data) {
        if (this.config.category === undefined || this.config.category === true) {
            const category = this.config.category || "PaellaPlayer";
            const action = data.event;
            const labelData = {
                videoId: id,
                plugin: data.plugin
            }

            try {
                // Test if data parameters can be serialized
                JSON.stringify(data.params);
                labelData.params = data.params;
            }
            catch(e) {}

            const label = JSON.stringify(labelData);

            __gaTracker(' send', 'event', category, action, label);
        }
    }
}