const imgUri = './test3.png';
const outputCanvas = document.getElementById('palette');

/*
 * @param {String} uri 图片地址
 * @return {Promise}
 */
function loadImg(uri) {
  const img = new Image();
    img.src = uri;

  return new Promise(function(resolve, reject) {
    img.onload = function() {
      document.body.insertBefore(img, palette);
      resolve(img);
    }
    img.onerror = function() {
      reject(new Error('图片加载失败'));
    }
  });
}

/*
 * @param {Image} imgObj 图片对象
 * @return {Array}
 */
function getPixel(imgObj) {
  const canvasObj = document.createElement('canvas');
    canvasObj.width = imgObj.width;
    canvasObj.height = imgObj.height;

  const canvasCtx = canvasObj.getContext('2d');
    canvasCtx.drawImage(imgObj, 0, 0, imgObj.width, imgObj.height);

  return canvasCtx.getImageData(0, 0, imgObj.width, imgObj.height);
}
/*
 * @param {HTMLCanvasElement} outputCanvas
 */
function draw(colors, outputCanvas) {
  outputCanvas.width = 500;
  outputCanvas.height = 300;
  console.log(outputCanvas)
  const unitWidth = 25;
  const unitHeight = 25;
  let originHeight = 0;
  const ctx = outputCanvas.getContext('2d');
  for (let i = 0; i < colors.length; i++) {
    let c = colors[i];
    let originWidth = unitWidth * (i % (outputCanvas.width / unitWidth));
    ctx.fillStyle = `rgb(${c[0]},${c[1]},${c[2]})`;
    if (originHeight / unitHeight < Math.floor((i / (outputCanvas.width / unitWidth)))) {
      originHeight += unitHeight;
    }
    ctx.fillRect(originWidth, originHeight, unitWidth, unitHeight);
  }
}

loadImg(imgUri)
  .then((imgObj) => {
    const colors = extract(getPixel(imgObj), 20, 3);
    draw(colors, outputCanvas);
  }).catch((err) => {
    console.log(err.stack);
  });
