# Paella Player user tracking plugin

It contains basic plugins for capturing user events, such as button or key presses.

## Included plugins

### User event tracker

It is an [event plugin](https://github.com/polimediaupv/paella-core/blob/main/doc/event_log_plugins.md) that records user events and sends them to a [data target](https://github.com/polimediaupv/paella-core/blob/main/doc/data_plugins.md). Subsequently, a second [data plugin](https://github.com/polimediaupv/paella-core/blob/main/doc/data_plugins.md) will be responsible for collecting this data and sending it to the corresponding target. The events captured by the plugin will be sent to the context defined by the `context` attribute of the plugin configuration.

```json
{
    "es.upv.paella.userEventTracker": {
        "enabled": true,
        "context": "userTracking"
    },
    ...
}

The events captured by the plugin are as follows:

```js
    Events.PLAY,
    Events.PAUSE,
    Events.SEEK,
    Events.STOP,
    Events.ENDED,
    Events.FULLSCREEN_CHANGED,
    Events.VOLUME_CHANGED,
    Events.BUTTON_PRESS,
    Events.SHOW_POPUP,
    Events.HIDE_POPUP,
    Events.RESIZE_END
```

**Exported as** `UserEventTrackerPlugin`.

### Debug user tracking data plugin

Collects the events sent by the `es.upv.paella.userEventTracker` plugin and sends them to the javascript console. It allows to debug the event configuration. The plugin can subscribe to one or more data contexts, but generally it will subscribe to the same context where the `en.upv.paella.userEventTracker` plugin sends events.

```json
{
    "es.upv.paella.debug.userTrackingDataPlugin": {
        "enabled": true,
        "context": [
            "userTracking"
        ],
        "events": [
            "PLAY",
            "PAUSE",
            "SEEK",
            "TIMEUPDATE"
        ]
    },
    ...
}
```

The `events` property is used to specify the events that will trigger an user tracking data event. If the `events` key is not defined in the configuration, the following events will be used by default:

- **PLAY**
- **PAUSE**
- **SEEK**
- **STOP**
- **ENDED**
- **FULLSCREEN_CHANGED**
- **VOLUME_CHANGED**
- **BUTTON_PRESS**
- **RESIZE_END**

If you define the `events` property, the list that you define will replace all the default events.

**Exported as** `DebugUserTrackingDataPlugin`.

### Google Analytics user tracking data plugin

Collects the events sent by the `es.upv.paella.userEventTracker` plugin and sends them to Google Analytics. In the plugin configuration, we'll set one or more data `context`, that must contains at least those defined in the `es.upv.paella.userEventTracker` plugin configuration, and the specific data for the analytics account.

```json
{
    "es.upv.paella.analytics.userTrackingDataPlugin": {
        "enabled": false,
        "trackingId": "G-xxxxxxxxxx",
        "domain": "",
        "category": true,
        "context": [
            "userTracking"
        ]
    },
}
```

**Exported as** `GoogleAnalyticsUserTrackingDataPlugin`.


