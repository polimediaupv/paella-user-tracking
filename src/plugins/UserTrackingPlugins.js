import { PluginModule } from "paella-core";
import packageData from "../../package.json";

export default class UserTrackingPlugins extends PluginModule {
    get moduleName() {
        return "paella-user-tracking";
    }

    get moduleVersion() {
        return packageData.version;
    }
}