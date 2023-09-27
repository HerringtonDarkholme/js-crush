import { ref } from 'vue'
// Create a new AudioContext object
const audioContext = new AudioContext()

export const hasSound = ref(true)

function createBuffer(soundURL: string) {
  // Create a request to fetch the sound file
  var request = new XMLHttpRequest()
  request.open("GET", soundURL, true)
  request.responseType = "arraybuffer"
  return new Promise<AudioBuffer>(resolve => {
    // When the request is loaded, decode the data and assign it to the buffer source
    request.onload = function() {
      audioContext.decodeAudioData(request.response, function(buffer) {
        resolve(buffer)
      })
    }
    // Send the request
    request.send()
  })
}

export const tile = () => createBuffer('/tile.aac').then(playBuffer)
export const promotion = () => createBuffer('/promotion.aac').then(playBuffer)
export const shuffle = () => createBuffer('/shuffle.aac').then(playBuffer)
export const correct = () => createBuffer('/eliminate.aac').then(playBuffer)
export const wrong = () => createBuffer('/wrong.aac').then(playBuffer)

function playBuffer(buffer: AudioBuffer ) {
  if (!hasSound.value) {
    return
  }
  // Create a buffer source node to play the sound
  var bufferSource = audioContext.createBufferSource()
  // set buffer
  bufferSource.buffer = buffer
  // Connect the buffer source to the destination (the speakers)
  bufferSource.connect(audioContext.destination)
  // Start playing the sound
  bufferSource.start(0)
}
