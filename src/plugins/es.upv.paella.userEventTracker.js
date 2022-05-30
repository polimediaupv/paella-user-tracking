import { Events, EventLogPlugin } from 'paella-core';

//const eventKeys = Object.keys(Events);

const getPaellaEvents = (events) => events.map(eventName => Events[eventName]);

export default class UserEventTrackerPlugin extends EventLogPlugin {
	get events() {
		if (this.config.events) {
			return getPaellaEvents(this.config.events);
		}
		else {
			return [
				Events.PLAY,
				Events.PAUSE,
				Events.SEEK,
				Events.STOP,
				Events.ENDED,
				Events.FULLSCREEN_CHANGED,
				Events.VOLUME_CHANGED,
				Events.BUTTON_PRESS,
				Events.RESIZE_END
			]
		}
	}

	async onEvent(event, params) {
		const id = this.player.videoId;
		// Remove plugin reference to avoid circular references
		if (params.plugin) {
			const { name, config } = params.plugin;
			params.plugin = { name, config }
		}
		const trackingData = { event, params }

		switch (event) {
		case Events.SHOW_POPUP:
		case Events.HIDE_POPUP:
		case Events.BUTTON_PRESS:
			trackingData.plugin = params.plugin?.name || null;
		}

		const context = this.config.context || "userTracking";
		await this.player.data.write(
			context,
			{ id },
			trackingData
		);
	}
}
