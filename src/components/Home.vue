<template lang="html">
  <div>
    <div class="container">
      <button class="cam-btn" v-on:click="initWebcam">
        <svg class="octicon octicon-device-camera-video" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M15.2 2.09L10 5.72V3c0-.55-.45-1-1-1H1c-.55 0-1 .45-1 1v9c0 .55.45 1 1 1h8c.55 0 1-.45 1-1V9.28l5.2 3.63c.33.23.8 0 .8-.41v-10c0-.41-.47-.64-.8-.41z"/></svg>
      </button>
      <div class="panel">
        <div class="title">{{title}} </div>
        <h5>

         <a href="https://quarryhillpto.com/sciencefair/">Quarry Hill STEM FAIR</a> Demo: Drawing images with the Alphabet
       </h5>
      </div>
     <div style="display:none" class="art-pics">
       <img id="img0" src="../assets/monalisa.jpg" width="20" height="12">
       <img id="img1" src="../assets/sunflowers.jpg" width="20" height="12">
       <img id="img2" src="../assets/CreationOfAdam.jpg" width="20" height="12">
       <img id="img3" src="../assets/Starry_Night.jpg" width="20" height="12">
       <img id="img4" src="../assets/The_Persistence_of_Memory.jpg" width="20" height="12">
       <img id="img5" src="../assets/Last_Supper.jpg" width="20" height="12">
       <img id="img6" src="../assets/gothic.jpg" width="20" height="12">
     </div>
    </div>
  </div>
</template>

<script>
import imagesLoaded from 'imagesloaded'
// for converting stream to video.src
window.URL = window.URL || window.webkitURL

// get webcam
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia || navigator.msGetUserMedia

export default {
  data () {
    return {
      captureSpeed: 2000,
      rowPixels: 10,
      colPixels: 8,
      imgIds: ['img0', 'img1', 'img2', 'img3', 'img4', 'img5', 'img6'],
      webcamDetected: false,
      paused: false,
      title: 'Alphabet Art'
    }
  },
  methods: {
    initWebcam () {
      clearInterval(window.timerObj)
      const video = document.querySelector('#video')
      const canvas = document.querySelector('canvas')
      const canvas2 = document.createElement('canvas')
      navigator.getUserMedia({video: true}, stream => {
        video.src = window.URL.createObjectURL(stream)
        if (!this.webcamDetected) {
          this.webcamDetected = true
          setTimeout(() => this.drawToCanvas({ image: video, canvas, canvas2, loop: true }), 1000)
        }
      }, e => console.log(`Failed to capture video ${e}`))
    },
    getChar (luminance) {
      // ASCII chars
      // const DARK_TO_LIGHT = "@$BW#MQ8ERN95D06&HgGOS3%UPKFIp2ZbAdq4wCha[]1{}JXekVliofunjLTz7Yst=?)(|+xcmvr^/_*!y;,-':`.".split('')

      // Alpha chars, "Letters"
      const darkToLight = 'BWMQERNDHgGOSUPJXekVliofunjLTzYstxcmvry'.split('')
      const normalizer = darkToLight.length / 256
      const index = Math.floor(luminance * normalizer)
      return darkToLight[index]
    },
    drawToContext (context, sourceImageData) {
      const sourcePixels = sourceImageData.data
      const numCols = sourceImageData.width
      const numRows = sourceImageData.height
      for (let row = 0; row < numRows; row += this.rowPixels) {
        const rowOffset = row * numCols * 4
        for (let col = 0; col < numCols; col += this.colPixels) {
          const offset = rowOffset + 4 * col
          const r = sourcePixels[offset]
          const g = sourcePixels[offset + 1]
          const b = sourcePixels[offset + 2]
          const luminance = Math.ceil(0.299 * r + 0.587 * g + 0.114 * b)
          const c = this.getChar(luminance)
          context.fillStyle = 'rgb(' + r + ',' + g + ',' + b + ')'
          context.fillText(c, col, row)
        }
      }
    },
    drawToCanvas ({ image, canvas, canvas2, delay = 30, loop = false }) {
      const width = document.body.clientWidth // for adaptive sizing
      const height = window.innerHeight // document.body.clientHeight
      canvas.width = width
      canvas.height = height
      canvas2.width = width
      canvas2.height = height
      const context2 = canvas2.getContext('2d')
      const context = canvas.getContext('2d')
      context2.drawImage(image, 0, 0, width, height)
      context.font = `${(this.rowPixels + 4)}px courier`
      this.drawToContext(context, context2.getImageData(0, 0, width, height))
      if (loop) {
        setTimeout(() => { this.drawToCanvas({ image, canvas, canvas2, loop }) }, delay)
      }
    },
    startSlideshow (startIndex, canvas, canvas2) {
      this.drawToCanvas({ image: document.getElementById(this.imgIds[0]), canvas, canvas2 })
      let imgIndex = startIndex
      window.timerObj = setInterval(() => {
        imgIndex++
        if (imgIndex > (this.imgIds.length - 1)) { imgIndex = 0 }
        this.drawToCanvas({ image: document.getElementById(this.imgIds[imgIndex]), canvas, canvas2 })
      }, 5000)
    },
    imagesLoaded () {
      const canvas = document.querySelector('canvas')
      const canvas2 = document.createElement('canvas')
      this.startSlideshow(0, canvas, canvas2)
    }
  },
  mounted () {
    clearInterval(window.timerObj)
    // this.initWebcam()
    imagesLoaded(document.querySelector('.container'), this.imagesLoaded)
  }
}
</script>

<style lang="css">
.controls {
  font-size:.25em;
}
.cam-btn {
  padding-top: 4px;
  font-size: .8em;
  float: left;
}
.title {
  font-size: 1.5em;
}
.panel {
  margin: auto;
  max-width: 440px;
  background: #eee;
}
#video {
  position: absolute;
  top: 3px;
  left: 3px;
  max-width: 100px;
}
.panel-body {
  font-family: "Lucida Console", "Lucida Sans Typewriter", monaco, "Bitstream Vera Sans Mono", monospace;
  font-size: 12px;
  text-align: left;
  color: #2bf22b;
  background-color: #000;
}
</style>
