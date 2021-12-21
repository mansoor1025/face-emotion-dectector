const video = document.getElementById('video_our')
// all promise be defined
Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models')
]).then(startVideo)

// function was start here to open webcam
function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )

}
var emotion = [];
// video add listener play 
function check(duration) {

  video.addEventListener('play', () => {
    alert('condition 1')
    // create canvas from media  
    const canvas = faceapi.createCanvasFromMedia(video)
    document.body.append(canvas)
    // create display canvas
    const displaySize = { width: video.width, height: video.height }
    faceapi.matchDimensions(canvas, displaySize);
    setInterval(async () => {
      const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
      const resizedDetections = faceapi.resizeResults(detections, displaySize)
      // create 2d canvas
      canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
      // create drawDetections canvas
      faceapi.draw.drawDetections(canvas, resizedDetections)
      // create drawFaceLandmarks canvas
      faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
      // create drawFaceExpressions canvas
      faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
      console.log('=======================');
      let data = {
        sad: Math.round(detections[0].expressions.disgusted),
        disgusted: Math.round(detections[0].expressions.disgusted),
        neutral: Math.round(detections[0].expressions.neutral),
        fearful: Math.round(detections[0].expressions.fearful),
        happy: Math.round(detections[0].expressions.happy),
        surprised: Math.round(detections[0].expressions.surprised),
        angry: Math.round(detections[0].expressions.angry),
      }
      emotion.push(data);
      // console.log(emotion);

    }, 100)

    setTimeout(function () {
      alert('lets go')
      // return

      localStorage.setItem("stats", JSON.stringify(emotion));
      location.href = 'stats.html';
    }, 33000);
    return


  })
}
// function popUp() {
//   // Do some Thing
//   alert('buddy ')
//   // SetTimeout to change display to none
//   setTimeout(function () {
//     alert('exit in 5 sec')
//   }, 5000);
// }

// popUp();