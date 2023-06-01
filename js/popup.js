console.log("----Popup Script is running----")
var recorder;



window.onload = function () {
    // chrome.tabCapture.capture({ audio: true, video: true }, function (stream) {
    //     try {
    //         console.log("check stream from popup", stream)

    //         startRecord(stream)


    //     } catch (error) {
    //         console.log(`Error: ${error}`);

    //     }
    // })
    // document.getElementById("captureWindowPage").onclick = function captureWindow(e) {
    //     chooseDesktopOption();

    // };
    // document.getElementById("captureWindowCancel").onclick = function captureCalcel(e) {
    //     stopRecord();
    //     window.close();
    // }
}

// Receive message from background.js
var toBackground = chrome.runtime.connect({
    name: location.href.replace(/\/|:|#|\?|\$|\^|%|\.|`|~|!|\+|@|\[|\||]|\|*. /g, '').split('\n').join('').split('\r').join('')
});

toBackground.onMessage.addListener(function (msg) {

    if (!msg || !msg.messageFromEdubay) {
        return;
    }

    if (msg.type === "startRecording") {
        console.log("popup", msg.type);
        chrome.tabCapture.getMediaStreamId({ consumerTabId: null }, function (streamId) {



            // chrome.tabCapture.capture({ audio: true, video: true }, function (stream) {
            try {
                console.log("check stream from popup", streamId)

                // startRecord(stream)
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

    } else if (msg.type === "stop_recording") {

        //     // stopRecord();
        //     msgData = {
        //         type: 'Recording_stoped',
        //         from: 'popupJs',
        //         to: 'BrowserJs',
        //         data: null
        //     }
        //     toBackground.postMessage(msgData);
        // }
        // if (msg.messageFromEdubay && msg.startedRecording) {
        //     console.log("onpopup captureTabUsingTabCapture")
        //     captureTabUsingTabCapture();
    }
});


function startRecord(stream) {


    let options = { mimeType: "video/webm;codecs=vp9,opus" };
    let recordedChunks = [];

    recorder = new MediaRecorder(stream, options);
    recorder.ondataavailable = function (e) {
        recordedChunks.push(e.data);
    };

    recorder.onstop = function (e) {
        let blob = new Blob(recordedChunks, {
            type: "video/webm",
        });
        recordedChunks = [];

        let url = URL.createObjectURL(blob);
        let a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        a.href = url;
        a.download = "wmeetingRecordedVideo." + "webm";
        a.click();
        window.URL.revokeObjectURL(url);
    };
    // recordedChunks = recordedChunks;
    recorder.start(15000);
    recorder.requestData();
}

function stopRecord() {
    if (recorder) {
        recorder.stop();
        recorder = null;
    }
}
