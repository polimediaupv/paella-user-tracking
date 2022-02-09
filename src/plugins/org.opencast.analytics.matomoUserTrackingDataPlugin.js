
import { DataPlugin  } from "paella-core";

export default class MatomoAnalyticsUserTrackingDataPlugin extends DataPlugin {
    async load() {
        const siteId = this.config.siteId;
        const server = this.config.server || "auto";
        const heartBeat = this.config.heartBeat;
        const privacyUrl = this.config.privacyUrl;
        const trackingClient = this.config.trackingClientName;
        const askForConcent = this.config.askForConcent;
        const cookieConsentBaseColor = this.config.cookieConsentBaseColor;
        const cookieConsentHighlightColor = this.config.cookieConsentHighlightColor;
        
        var trackingPermission,
            tracked;

            paella.cookieconsent_base_color = this.cookieconsent_base_color;
            paella.cookieconsent_highlight_color = this.cookieconsent_highlight_color;
  
        function trackMatomo() {
        if (isTrackingPermission() && !tracked && server && site_id){
            if (server.substr(-1) != '/') server += '/';
            paella.require(server + tracking_client + ".js")
            .then((matomo) => {
                paella.log.debug("Matomo Analytics Enabled");
                paella.userTracking.matomotracker = Matomo.getAsyncTracker( server + tracking_client + ".php", site_id );
                paella.userTracking.matomotracker.client_id = thisClass.config.client_id;
                if (heartbeat && heartbeat > 0) paella.userTracking.matomotracker.enableHeartBeatTimer(heartbeat);
                if (Matomo && Matomo.MediaAnalytics) {
                paella.events.bind(paella.events.videoReady, () => {
                    Matomo.MediaAnalytics.scanForMedia();
                });
                }
                thisClass.registerVisit();
                tracked = true;
            });
            return true;
        }	else {
            paella.log.debug("No tracking permission or no Matomo Site ID found in config file. Disabling Matomo Analytics PlugIn");
            return false;
        }
        }

        function initCookieNotification() {
            // load cookieconsent lib from remote server
            paella.require(paella.baseUrl + 'javascript/cookieconsent.min.js')
            .then(() => {
                paella.log.debug("Matomo: cookie consent lib loaded");
                window.cookieconsent.initialise({
                    "palette": {
                        "popup": {
                            "background": cookieconsent_base_color
                        },
                        "button": {
                            "background": cookieconsent_highlight_color
                        }
                    },
                    "type": "opt-in",
                    "position": "top",
                    "content": {
                        "message": translate('matomo_message', "This site would like to use Matomo to collect usage information of the recordings."),
                        "allow": translate('matomo_accept', "Accept"),
                        "deny": translate('matomo_deny', "Deny"),
                        "link": translate('matomo_more_info', "More information"),
                        "policy": translate('matomo_policy', "Cookie Policy"),
                        // link to the Matomo platform privacy policy - describing what are we collecting
                        // through the platform
                        "href": privacy_url
                    },
                    onInitialise: function (status) {
                        var type = this.options.type;
                        var didConsent = this.hasConsented();
                        // enable cookies - send user data to the platform
                        // only if the user enabled cookies
                        if (type == 'opt-in' && didConsent) {
                            setTrackingPermission(true);
                        } else {
                            setTrackingPermission(false);
                        }
                    },
                    onStatusChange: function (status, chosenBefore) {
                        var type = this.options.type;
                        var didConsent = this.hasConsented();
                        // enable cookies - send user data to the platform
                        // only if the user enabled cookies
                        setTrackingPermission(type == 'opt-in' && didConsent);
                    },
                    onRevokeChoice: function () {
                        var type = this.options.type;
                        var didConsent = this.hasConsented();
                        // disable cookies - set what to do when
                        // the user revokes cookie usage
                        setTrackingPermission(type == 'opt-in' && didConsent);
                    }
                })
            });
        }

        function initTranslate(language, funcSuccess, funcError) {
            paella.log.debug('Matomo: selecting language ' + language.slice(0,2));
            var jsonstr = window.location.origin + '/player/localization/paella_' + language.slice(0,2) + '.json';
            $.ajax({
                url: jsonstr,
                dataType: 'json',
                success: function (data) {
                    if (data) {
                        data.value_locale = language;
                        translations = data;
                        if (funcSuccess) {
                            funcSuccess(translations);
                        }
                    } else if (funcError) {
                        funcError();
                    }
                },
                error: function () {
                    if (funcError) {
                        funcError();
                    }
                }
            });
        }

        function translate(str, strIfNotFound) {
            return (translations[str] != undefined) ? translations[str] : strIfNotFound;
        }

        function isTrackingPermission() {
            if (checkDoNotTrackStatus() || !trackingPermission) {
                return false;
            } else {
                return true;
            }
        }

        function checkDoNotTrackStatus() {
            if (window.navigator.doNotTrack == 1 || window.navigator.msDoNotTrack == 1) {
                paella.log.debug("Matomo: Browser DoNotTrack: true");
                return true;
            }
            paella.log.debug("Matomo: Browser DoNotTrack: false");
            return false;
        }

        function setTrackingPermission(permissionStatus) {
            trackingPermission = permissionStatus;
            paella.log.debug("Matomo: trackingPermissions: " + permissionStatus);
            trackMatomo();
        };

        if (ask_for_concent) {
        initTranslate(navigator.language, function () {
            paella.log.debug('Matomo: Successfully translated.');
            initCookieNotification();
        }, function () {
            paella.log.debug('Matomo: Error translating.');
            initCookieNotification();
        });
        } else {
        trackingPermission = true;
        }

        onSuccess(trackMatomo());

    } // checkEnabled

    setVideoTitleAttr(){
        var video_element = video_element = document.getElementsByTagName("video");
        video_element.video_0.setAttribute("data-matomo-title", document.title);
    }

    registerVisit() {
        var title,
            event_id,
            series_title,
            series_id,
            presenter,
            view_mode;

        if ((paella.opencast != undefined) && (paella.opencast._episode != undefined)) {
        title = paella.opencast._episode.dcTitle;
        event_id = paella.opencast._episode.id;
        presenter = paella.opencast._episode.dcCreator;
        paella.userTracking.matomotracker.setCustomVariable(5, "client",
            (paella.userTracking.matomotracker.client_id || "Paella Opencast"));
        } else {
        title = this.loadTitle();
        // Add title for Matomo Media Analytics.
        if (this.config.html_title){
            this.setVideoTitleAttr();
        } else{
            Matomo.MediaAnalytics.setMediaTitleFallback(function (mediaElement) {return title; });
        }
        paella.userTracking.matomotracker.setCustomVariable(5, "client",
            (paella.userTracking.matomotracker.client_id || "Paella Standalone"));          
        }

        if ((paella.opencast != undefined) && (paella.opencast._episode != undefined) && (paella.opencast._episode.mediapackage != undefined)) {
        series_id = paella.opencast._episode.mediapackage.series;
        series_title = paella.opencast._episode.mediapackage.seriestitle;
        }

        if (title)
        paella.userTracking.matomotracker.setCustomVariable(1, "event", title + " (" + event_id + ")", "page");
        if (series_title)
        paella.userTracking.matomotracker.setCustomVariable(2, "series", series_title + " (" + series_id + ")", "page");
        if (presenter) paella.userTracking.matomotracker.setCustomVariable(3, "presenter", presenter, "page");
        paella.userTracking.matomotracker.setCustomVariable(4, "view_mode", view_mode, "page");
        if (title && presenter) {
        paella.userTracking.matomotracker.setDocumentTitle(title + " - " + (presenter || "Unknown"));
        paella.userTracking.matomotracker.trackPageView(title + " - " + (presenter || "Unknown"));
        } else {
        paella.userTracking.matomotracker.trackPageView();
        }
    }

    loadTitle() {
        var title = paella.player.videoLoader.getMetadata() && paella.player.videoLoader.getMetadata().title;
        return title;
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