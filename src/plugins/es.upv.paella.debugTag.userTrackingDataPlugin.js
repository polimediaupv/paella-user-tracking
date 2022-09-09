
import { DataPlugin } from 'paella-core';

export default class DebugTagTrackingDataPlugin extends DataPlugin {

    async load() {
        if (this.config.tagId) {
            this._elem = document.getElementById(this.config.tagId);
        }
    }

    async write(context, { id }, data) {
        if (this._elem) {
            this._elem.innerHTML += '<br/>' + id + " " + data.event;
        }
    }
}