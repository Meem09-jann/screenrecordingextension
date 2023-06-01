
let msgData = {
    type: '',
    from: '',
    to: '',
    data: ''
}
var isRecording = false;

let toPopup;
// receive messages from content_script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.from === "edubayMeetings" && message.type) {
        console.log("message at background from content script", message.type);
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
        console.log("message at background to popup", message.type);
        // send message to browser
        chrome.tabs
            .query({
                currentWindow: true,
                active: true,
            })
            .then(tabs => {
                for (const tab of tabs) {
                    chrome.tabs
                        .sendMessage(activeTabId, message)
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
let activeTab;
let activeTabId;
chrome.tabs.query({
    active: true,
    currentWindow: true
}, async function (arrayOfTabs) {
    activeTab = arrayOfTabs[0];
    activeTabId = activeTab.id;
    console.log("active ", activeTabId)
})
function getTab() {
    // toPopup.postMessage({ type: 'startRecording', tabId: activeTabId });
    chrome.windows.create({
        url: 'record.html',
        focused: false,
        type: 'popup',
        height: 200,
        width: 300,
    }, (win) => {

        console.log("new  created window", win)
        setTimeout(() => {

            toPopup.postMessage({ type: 'startRecording', tabId: activeTabId });

        }, 5000);
    });
    // chrome.tabs.create({
    //     url: 'popup.html',
    // });

    // chrome.tabs.query({
    //     active: true,
    //     currentWindow: true
    // }, async function (arrayOfTabs) {
    //     let id;
    //     let activeTab = arrayOfTabs[0];
    //     let activeTabId = activeTab.id;
    //     const { streamId, options } = await new Promise((resolve) => {
    //         id = chrome.desktopCapture.chooseDesktopMedia(
    //             ['tab', 'screen', 'window', 'audio'],
    //             activeTab,
    //             async (streamId, options) => {
    //                 resolve({ streamId, options });
    //             }
    //         );

    //     }).catch((err) => console.error(err));
    // let streamId2;
    // chrome.tabCapture.capture({ audio: true, video: true }, function (stream) {
    //     streamId2 = stream.id
    // });
    //     chrome.tabs
    //         .sendMessage(activeTabId, {
    //             type: "getStreamId",
    //             from: 'edubayScreenExtension',
    //             streamId: streamId
    //         })
    //         .catch(er => {
    //             console.error(er);
    //         });


    //     // chrome.desktopCapture.cancelChooseDesktopMedia(
    //     //     { desktopMediaRequestId: id }
    //     // )

    //     // const [{ frameId, result }] = await chrome.scripting.executeScript({
    //     //     target: {
    //     //         tabId: activeTabId,
    //     //     },
    //     //     world: 'MAIN',
    //     //     args: [streamId],
    //     //     func: captureStream,
    //     // });
    //     // console.log(frameId, result);
    // })
}
