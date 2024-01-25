// This file contains utils functions to be reused between multiple components.

const arrayBufferToString = (arrayBuffer: ArrayBuffer): string => {
    let binary = '';
    const bytes = new Uint8Array(arrayBuffer);
    const len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return binary
}

const arrayBufferToBase64 = (arrayBuffer: ArrayBuffer) => window.btoa(arrayBufferToString(arrayBuffer));

const downloadObjectAsJson = (exportObj, exportName) => {
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

export {
    arrayBufferToBase64,
    downloadObjectAsJson,
}