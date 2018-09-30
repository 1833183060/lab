class TreeNode {
  constructor(value) {
    this.value = value;
    this.parent = null;
    this.children = {};
    this.count = 1;
    this.isLeaf = false;
  }
}

const Octree = {
  root: new TreeNode(),
  /*
   * 插入一串
   * @param {Array} valueArr
   * @param {Number} layer
   */
  insert: function(valueArr, layer) {
    layer = layer || 5;
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
      if (layer === 1) {
        currentNode.isLeaf = true;
      }
      layer--;
    }
  },
  average: function(layer) {
  },
  /*
   * 获取该树所有的叶子节点
   * @param {TreeNode} parent
   * @return {Array<TreeNode>}
   */
  getAllLeafNodes: function(parent) {
    parent = parent || this.root;
    if (parent.isLeaf) {
      return parent;
    }
    let leafValues = [];
    const children = parent.children;
    const childrenName = Object.keys(children);
    for (let i = 0; i < childrenName.length; i++) {
      const r = this.getAllLeafNodes(children[childrenName[i]]);
      if (Array.isArray(r)) {
        leafValues = leafValues.concat(r);
      } else {
        leafValues.push(r);
      }
    }
    return leafValues;
  },
  /*
   * 获取某个节点所有祖先元素的值
   * @param {TreeNode} child
   * @return {Array} 低位到高位
   */
  getAllAncestorsValue: function(child) {
    const r = [];
    while (child.parent !== null) {
      r.push(child.value);
      child = child.parent
    }
    return r;
  }
}

/*
 * @param {ImageData} imgData
 * @return {Array}
 */
function extract(imgData, topN, fidelity) {
  topN = topN || 20;
  fidelity = fidelity || 3;
  const pixels = imgData.data;
  const step = 4;
  for (let i = 0; i < imgData.width * imgData.height; i++) {
    let base = i * step;
    let r = pixels[base];
    let g = pixels[base + 1];
    let b = pixels[base + 2];
    let opted = [optColor(r), optColor(g), optColor(b)];
    let unfoldRGB = unfold.apply(unfold, opted);
    Octree.insert(unfoldRGB, fidelity);
  }
  const topNNodes = getTheTopN(Octree.getAllLeafNodes(), topN);
  console.log(topNNodes)
  const r = [];
  for (let i = 0; i < topNNodes.length; i++) {
    let unfoldValue = Octree.getAllAncestorsValue(topNNodes[i]);
    r.push(fold(unfoldValue));
  }
  return r;
}

function optColor(c) {
  const parts = [c & 127, c & 63, c & 31];
  switch(true) {
    case 127 - parts[0] <= 3:
      return c + 127 - parts[0] + 1;
    case 63 - parts[1] <= 3:
      return c + 63 - parts[1] + 1;
    case 31 - parts[2] <= 3:
      return c + 31 - parts[2] + 1;
  }
  return c;
}

/*
 * @param {Array<TreeNode>} array 叶子节点数组
 * @param {Number} n 获取前n个
 * @return {Array<TreeNode>}
 */
function getTheTopN(array, n) {
  array.sort(function(a, b) {
    return b.count - a.count;
  });
  return array.slice(0, n);
}

/*
 * @param {Number} a
 * @param {Number} b
 * @param {Number} c
 * @return {Array} 低位到高位
 */
function unfold(a, b, c) {
  const result = [];
  for (let i = 0; i < 8; i++) {
    let r = ((a & 1) << 2) | ((b & 1) << 1) | (c & 1);
    result.push(r);
    a >>= 1;
    b >>= 1;
    c >>= 1;
  }
  return result;
}

/*
 * @param {Array} array 低位到高位
 * @return {Array} RGB
 */
function fold(array) {
  let currentNum;
  let r, g, b;
  const length = array.length;
  while((currentNum = array.pop()) !== undefined) {
    r = (r << 1) | ((currentNum >> 2) & 1);
    g = (g << 1) | ((currentNum >> 1) & 1);
    b = (b << 1) | (currentNum & 1);
  }
  let delta = 8 - length;
  r <<= delta;
  g <<= delta;
  b <<= delta;
  return [r, g, b];
}
