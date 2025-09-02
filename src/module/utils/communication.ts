export function sendMessageBack(message: object) {
    console.log(message);
    figma.ui.postMessage({ pluginMessage: message, });
}