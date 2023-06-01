// console.log("recorder.js", chrome)
var toBackground = chrome.runtime.connect();
let activeTab;
let activeTabId;
chrome.tabs.query({
    active: true,
    currentWindow: true
}, async function (arrayOfTabs) {
    activeTab = arrayOfTabs[0];
    activeTabId = activeTab.id;
    console.log("recorder.js", activeTabId);
})
toBackground.onMessage.addListener(function (msg) {

    if (msg.type === "startRecording") {
        chrome.tabCapture.getMediaStreamId({ consumerTabId: msg.tabId, targetTabId: msg.tabId }, function (streamId) {
            // chrome.tabCapture.capture({ audio: true, video: true }, function (stream) {
            try {
                console.log("check stream from recorder.js", streamId)

                msgData = {
                    type: 'getStreamId',
                    from: 'edubayScreenExtension',
                    streamId: streamId
                }
                toBackground.postMessage(msgData);

            } catch (error) {
                console.log(`Error: ${error}`);

            }
        })

    }
});