
let msgData = {
    type: '',
    from: '',
    to: '',
    data: ''
}
window.onload = function () {
    msgData.type = 'extensionCheck';
    msgData.from = 'edubayScreenExtension';
    msgData.to = 'edubayMeetings';
    msgData.isExtension = true;
    window.postMessage(msgData, "*")
}

// message from webpage
window.addEventListener("message", function (event) {
    if (event.source != window) return;
    if (event.data.from === "edubayMeetings" && event.data.type) {
        switch (event.data.type) {
            case "extensionCheck":
                msgData.type = 'extensionCheck';
                msgData.from = 'edubayScreenExtension';
                msgData.to = 'edubayMeetings';
                msgData.isExtension = true;
                window.postMessage(msgData, "*")
                break;
            case "startRecording":

                break;
            case "stopRecording":

                break;
        }
    }
    // message to background.js
    chrome.runtime.sendMessage(event.data);
});





// message from background.js
chrome.runtime.onMessage.addListener((msg) => {
    if (msg.from === "edubayScreenExtension" && msg.type) {
        console.log("message at content script from background", msg.type);
        switch (msg.type) {
            case "getStreamId":
                msg.screenStreamId = true
                window.postMessage(msg, "*")
                break;
            case "recordingStarted":
                msg.screenStreamId = true
                window.postMessage(msg, "*")
                break;
        }
    }
});

