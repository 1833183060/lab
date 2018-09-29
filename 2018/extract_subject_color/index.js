const imgUri = './test1.png';
const outputCanvas = document.getElementById('mycanvas');

/*
 * @param {String} uri 图片地址
 * @return {Promise}
 */
function loadImg(uri) {
  const img = new Image();
    img.src = uri;

  return new Promise(function(resolve, reject) {
    img.onload = function() {
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

loadImg(imgUri)
  .then((imgObj) => {
    extract(getPixel(imgObj), outputCanvas);
  }).catch((err) => {
    console.log(err.stack);
  });
