
let msgData = {
    type: '',
    from: '',
    to: '',
    data: ''
}
var isRecording = false;
var bitsPerSecond = 0;
var isChrome = true; // used by RecordRTC

var enableTabCaptureAPI = false;
var enableTabCaptureAPIAudioOnly = false;

var enableScreen = true;
var enableMicrophone = false;
var enableCamera = false;
var cameraStream = false;

var enableSpeakers = true;

var videoCodec = 'Default';
var videoMaxFrameRates = '';
var videoResolutions = '1920x1080';

var startedVODRecordedAt = (new Date).getTime();

var startRecordingCallback = function () { };
var stopRecordingCallback = function (file) { };
var openPreviewOnStopRecording = true;
var openCameraPreviewDuringRecording = true;

var fixVideoSeekingIssues = false;

chrome.storage.sync.set({
    isRecording: 'false' // FALSE
});


let toPopup;
// receive messages from content_script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.from === "edubayMeetings" && message.type) {
        switch (message.type) {
            case "startRecording":
                getTab();
                break;
            case "stopRecording":

                break;
        }
    }

});

// receive message from popup.js
chrome.runtime.onConnect.addListener(function (port) {
    toPopup = port;

    port.onMessage.addListener(function (message) {
        console.log("message at background from popup  ", message.type);

        // send message to browser
        chrome.tabs
            .query({
                currentWindow: true,
                active: true,
            })
            .then(tabs => {
                for (const tab of tabs) {
                    chrome.tabs
                        .sendMessage(tab.id, message)
                        .then((response) => {

                        })
                        .catch(er => {
                            console.error(er);
                        });
                }
            })
            .catch(er => {
                console.error(er);
            });
    });
})

function getTab() {

    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, async function (arrayOfTabs) {
        let id;
        let activeTab = arrayOfTabs[0];
        let activeTabId = activeTab.id;
        const { streamId, options } = await new Promise((resolve) => {
            id = chrome.desktopCapture.chooseDesktopMedia(
                ['tab', 'screen', 'window', 'audio'],
                activeTab,
                async (streamId, options) => {
                    resolve({ streamId, options });
                }
            );

        }).catch((err) => console.error(err));

        chrome.tabs
            .sendMessage(activeTabId, {
                type: "getStreamId",
                from: 'edubayScreenExtension',
                streamId: streamId
            })
            .catch(er => {
                console.error(er);
            });


        //     // chrome.desktopCapture.cancelChooseDesktopMedia(
        //     //     { desktopMediaRequestId: id }
        //     // )

    })
}
