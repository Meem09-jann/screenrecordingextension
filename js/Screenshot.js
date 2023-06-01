class Screenshot {
  constructor() {
    //video

    this.videoWidth = screen.width;
    this.videoHeight = screen.height;
    this.frameRate = 60;
    this.cv = document.createElement("canvas");
    this.cv.setAttribute("id", "screenCanvas");
    this.cv.width = this.videoWidth;
    this.cv.height = this.videoHeight;
    this.context = this.cv.getContext("2d");
    this.recording = null;
    this.videoElement = document.createElement("video");
    this.videoElement.autoplay = true;
    this.videoElement.height = 320;
    document.body.appendChild(this.videoElement);
    document.body.appendChild(this.cv);
    this.cv.style.display = 'none'
    this.currentStream = null;
  }
  captureWindow() {
    this.recording = setTimeout(this.draw.bind(this), 500);
  }
  draw() {
    let self = this;
    chrome.tabCapture.capture({ audio: false, video: true }, function (data) {
      try {
        this.currentStream = data;
        self.videoElement.srcObject = this.currentStream;
        self.videoElement.play();

      } catch (error) {
        console.log(`Error: ${error}`);

      }
    })
  }

}

