class TreeNode {
  constructor(value) {
    this.value = value || null;
    this.parent = null;
    this.children = {};
    this.count = 1;
  }
}
const Octree = {
  root: new TreeNode(),
  /*
   * @param <Array> valueArr
   * @param <Number> layer
   */
  insert: function(valueArr, layer) {
    let currentNode = this.root;
    while (layer !== 0) {
      const value = valueArr.pop();
      const currentNodeChildren = currentNode.children;
      if (currentNodeChildren[value] === undefined) {
        const newNode = new TreeNode(value);
          newNode.parent = currentNode;
        currentNodeChildren[value] = newNode;
      } else {
        currentNodeChildren[value].count++;
      }
      currentNode = currentNodeChildren[value];
      layer--;
    }
  },
  average: function(layer) {
  }
}

/*
 * @param {ImageData} imgData
 * @param {HTMLCanvasElement} outputCanvas
 */
function extract(imgData, outputCanvas) {
  const pixels = imgData.data;
  const step = 4;
  for (let i = 0; i < imgData.width * imgData.height; i++) {
    let base = i * step;
    let r = pixels[base];
    let g = pixels[base + 1];
    let b = pixels[base + 2];
    let unfoldRGB = unfold(r, g, b);
    Octree.insert(unfoldRGB);
  }
}

/*
 * @param {Number} a
 * @param {Number} b
 * @param {Number} c
 * @return {Array} 低位到高位
 */
function unfold(a, b, c) {
  const result = [];
  for (let i = 0; i < 7; i++) {
    let r = ((a & 1) << 2) | ((b & 1) << 1) | (c & 1);
    result.push(r);
    a >>= 1;
    b >>= 1;
    c >>= 1;
  }
  return result;
}
