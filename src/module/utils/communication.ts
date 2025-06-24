export function sendMessageBack(message: object) {
    figma.ui.postMessage({ pluginMessage: message, });
}