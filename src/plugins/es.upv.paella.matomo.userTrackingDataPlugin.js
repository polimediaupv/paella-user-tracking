
import { DataPlugin, Events, bindEvent  } from "paella-core";

export default class MatomoUserTrackingDataPlugin extends DataPlugin {
    async load() {
        const matomoGlobalLoaded = this.config.matomoGlobalLoaded ?? false;
        const server = this.config.server;
        const siteId = this.config.siteId;

        if (matomoGlobalLoaded) {
            var _paq = window._paq = window._paq || [];
            this.player.log.debug('Assuming Matomo analytics is initialized globaly.');
            if (server) {
                this.player.log.warn('Matomo plugin: `server` parameter is defined, but never used because Matomo is loaded globaly in the page. Is it an error? Please check it.');
            }
            if (siteId) {
                this.player.log.warn('Matomo plugin: `siteId` parameter is defined, but never used because Matomo is loaded globaly in the page. Is it an error? Please check it.');
            }
        }
        else {
            if (server && siteId) {
                this.player.log.debug("Matomo analytics plugin enabled.");
                var _paq = window._paq = window._paq || [];
                _paq.push(['trackPageView']);
                _paq.push(['enableLinkTracking']);
                (function() {
                    var u=server;
                    _paq.push(['setTrackerUrl', u+'matomo.php']);
                    _paq.push(['setSiteId', siteId]);
                    var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
                    g.type='text/javascript'; g.async=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
                })();
            }
            else {
                this.player.log.warn('Matomo plugin: Plugin is enabled, but is not configured correctly. Plaase configue `server`and `siteId` parameters.');
            }
        }
    }
    
    async write(context, { id }, data) {
        const currentTime = await this.player.videoContainer.currentTime();
        // console.log(`matomo -> time: ${ currentTime }, video id: ${ id }`, context, data);
        const category = this.config.category || "PaellaPlayer";

        switch (data.event) {
            case Events.PLAY:
            case Events.PAUSE:
            case Events.STOP:
            case Events.ENDED:
                _paq.push(['trackEvent', category, data.event, id]);
                break;
            case Events.SEEK:
                _paq.push(['trackEvent', category, data.event, id, Math.round(data.params.newTime)]);
                break;
            case (Events.FULLSCREEN_CHANGED):
                _paq.push(['trackEvent', category, data.event, id,  data.event ? 'Enter' : 'Exit']);
                break;
            case Events.VOLUME_CHANGED:
                _paq.push(['trackEvent', category, data.event, id, data.params.volume*100]);
                break;
            case Events.TIMEUPDATE:
                break;
            case Events.TRIMMING_CHANGED:
                break;
            case Events.CAPTIONS_CHANGED:
                break;
            case Events.BUTTON_PRESS:
                _paq.push(['trackEvent', category, data.event, id, data.params.plugin.name]);
                break;
            case Events.SHOW_POPUP:
                _paq.push(['trackEvent', category, data.event, id, data.params.plugin.name]);
                break;
            case Events.HIDE_POPUP:
                _paq.push(['trackEvent', category, data.event, id, data.params.plugin.name]);
                break;
            case Events.MANIFEST_LOADED:
                break;
            case Events.STREAM_LOADED:
                break;
            case Events.PLAYER_LOADED:
                _paq.push(['trackEvent', category, data.event, id]);
                break;
            case Events.PLAYER_UNLOADED:
                 break;
            case Events.RESIZE:
                break;
            case Events.RESIZE_END:
                _paq.push(['trackEvent', category, data.event, id, `${ data.params.size.w }x${ data.params.size.h }` ]);
                break;
            case Events.LAYOUT_CHANGED:
                // _paq.push(['trackEvent', category, data.event, id, `` ]); // TODO
                break;
            case Events.PLAYBACK_RATE_CHANGED:
                _paq.push(['trackEvent', category, data.event, id, data.params.newPlaybackRate ]);
                break;      
            case Events.VIDEO_QUALITY_CHANGED:
                break;
            case Events.HIDE_UI:
                break;
            case Events.SHOW_UI:
                break;
            default:
                this.player.log.warn(`Matomo plugin: Event '${data.event} not logged.`);
                break;
        }
    }
}