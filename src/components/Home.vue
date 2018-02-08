<template lang="html">
  <div>
    <video id="video" autoplay></video>
    <div class="container">
      <h2>{{title}}</h2>
      <span class="controls"></span>
      <figure>
       <a href="https://quarryhillpto.com/sciencefair/">Quarry Hill STEM FAIR</a> Demo
       <div class="">
         Drawing images with the Alphabet
       </div>
      </figure>
      <canvas></canvas>
    </div>
  </div>
</template>

<script>
// for converting stream to video.src
window.URL = window.URL || window.webkitURL

// get webcam
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia || navigator.msGetUserMedia

const ROW_PIXELS = 10
const COL_PIXELS = 8
let WEBCAM_DETECTED = false

export default {
  data () {
    return {
      captureSpeed: 2000,
      webcamDetected: false,
      paused: false,
      title: 'Alphabet Art'
    }
  },
  methods: {
    initDrawing () {
      const video = document.querySelector('#video')
      const canvas = document.querySelector('canvas')
      const textCanvas = document.createElement('canvas')
      navigator.getUserMedia({video: true}, stream => {
        video.src = window.URL.createObjectURL(stream)
        if (!WEBCAM_DETECTED) {
          console.log('initWebcam >>>>')
          WEBCAM_DETECTED = true
          setTimeout(() => { this.drawLoop(video, canvas, textCanvas) }, 2000)
        }
      }, e => console.log(`Failed to capture video ${e}`))
    },
    getChar (luminance) {
      // ASCII chars
      // const DARK_TO_LIGHT = "@$BW#MQ8ERN95D06&HgGOS3%UPKFIp2ZbAdq4wCha[]1{}JXekVliofunjLTz7Yst=?)(|+xcmvr^/_*!y;,-':`.".split('')

      // Alpha chars, "Letters"
      const DARK_TO_LIGHT = 'BWMQERNDHgGOSUPJXekVliofunjLTzYstxcmvry'.split('')
      const NORMALISER = DARK_TO_LIGHT.length / 256
      const index = Math.floor(luminance * NORMALISER)
      return DARK_TO_LIGHT[index]
    },
    drawToContext (context, sourceImageData) {
      const sourcePixels = sourceImageData.data
      const numCols = sourceImageData.width
      const numRows = sourceImageData.height
      for (let row = 0; row < numRows; row += ROW_PIXELS) {
        const rowOffset = row * numCols * 4
        for (let col = 0; col < numCols; col += COL_PIXELS) {
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
    drawLoop (video, canvas, textCanvas, delay = 30) {
      const width = window.innerWidth - 30 // for adaptive sizing
      const height = width * 0.57
      canvas.width = width
      canvas.height = height
      textCanvas.width = width
      textCanvas.height = height
      const textContext = textCanvas.getContext('2d')
      const context = canvas.getContext('2d')
      textContext.drawImage(video, 0, 0, width, height)
      context.font = `${(ROW_PIXELS + 4)}px courier`
      this.drawToContext(context, textContext.getImageData(0, 0, width, height))
      setTimeout(() => { this.drawLoop(video, canvas, textCanvas) }, delay)
    }
  },
  mounted () {
    console.log('INIT')
    this.initDrawing()
  }
}
</script>

<style lang="css">
.controls {
  font-size:.25em;
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
