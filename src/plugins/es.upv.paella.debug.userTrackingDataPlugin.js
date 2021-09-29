
import { DataPlugin } from 'paella-core';

export default class DebugUserTrackingDataPlugin extends DataPlugin {
    async write(context, { id }, data) {
        console.log(`id: ${ id }`, context, data);
    }
}
