
export default function getUserTrackingPluginsContext() {
    return require.context("./plugins", true, /\.js/)
}
