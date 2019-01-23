/*
 * fragnment -> {{(.*)}}
 * a Portion associates with a fragnment
 * user data block -> node.data
 * a user data block associates with a number of Portions
 * 
 * Temporarily, if someone of datas has changed, rerender all block.
 * And give up regexp.
 *
 * Render procedure: evaluate to Portion -> update UserDataBlock -> render to DOM Node
 */
const Sue = (function() {

const TYPE_TEXT = 3;
const TYPE_ELEMENT = 1;
const TYPE_DOCUMENT = 10;

const F_ATTR_VARI = 1;
const F_ATTR_FOR = 2;
const F_ATTR_ENDFOR = 3;
const F_ATTR_IF = 4;
const F_ATTR_ENDIF = 5;
const F_ATTR_EXP = 6;

// Array<Portion>
const waitingToRenderPortion = [];

let baseScope = null;

class Portion {
  constructor({
    fragnment,
    tokens,
    attr,
    node,
    scope,
    body
  }) {
    this.tokens = tokens;
    this.attr = attr;
    this.fragnment = fragnment;
    this.node = node;
    this.scope = scope;
    this.body = body;
  }
}

class UserDataBlock {
  constructor(userData) {
    this.fragnments = [];
    this.blocks = [];

    if (userData) {
      this.getBlocks(userData);
    }
  }

  getBlocks(userData) {
    this.blocks = this.splitUserData(userData);
    console.log('blocks: ', this.blocks)
  }

  splitUserData(userData) {
    const braceStack = [];
    let temp = [];
    const result = [];

    for (let i = 0; i < userData.length; i++) {
      let d = userData[i];
      switch(d) {
        case '\\':
          temp.push(userData[++i]);
          break;
        case '{':
          if (temp.length !== 0) {
            result.push({
              type: 'text',
              content: temp.join('')
            });
            temp = [];
          }
          braceStack.push(d);
          break;
        case '}':
          braceStack.pop();
          if (braceStack[braceStack.length - 1] === '{') {
            const f = temp.join('');
            result.push({
              type: 'fragnment',
              content: f
            });
            this.fragnments.push({
              posi: result.length - 1,
              content: f
            });
            temp = [];
          }
          break;
        default:
          temp.push(d);
      }
    }
    console.log(result)
    return result;
  }
}

class Scope {
  constructor(scope, parent, child) {
    this.scope = scope;
    this.parent = parent || null;
    this.child = child || null;
  }
  get(vari) {
    return this.scope[vari];
  }
}

class ScopeLink {
  constructor(rootScope) {
    this.root = new Scope(rootScope);
    this.top = this.root;
  }
  addChild(rawScope) {
    this.top.child = new Scope(rawScope, this.top, null);
    this.top = this.top.child;
  }
  search(vari) {
    function handler(vari, scope) {
      if (scope === null) {
        throw new Error(`Variable ${vari} is not exist`);
      }
      return scope[vari] !== undefined ? scope[vari] : handler(vari, scope.parent);
    }
    return handler(vari, this.top);
  }
}

function traverse (root) {
  const childNodes = root.childNodes;
  const blankCReg = /^\s+$/g; 
  for(let i = 0; i < childNodes.length; i++) {
    const node = childNodes[i];
    switch(node.nodeType) {
      case TYPE_TEXT:
        if (blankCReg.test(node.data)) {
          break;
        }
        // create a portion
        const thisBlock = new UserDataBlock(node.data);
        thisBlock.fragnments.forEach(function(fragnment) {
          createAPortion(node, block, fragnment);
        })
        break;
      case TYPE_ELEMENT:
        if (node.childNodes.length !== 0) {
          traverse(node);
        }
        break;
      case TYPE_DOCUMENT:
        break;
      default:
        console.log(node)
        throw new Error(`Node ${node} has an unexpected node type ${node.nodeType}`);
    }
  }
}

function createAPortion(node, block, fragnment) {
  const tokens = getTokens(fragnment);
  waitingToRenderPortion.push(new Portion({
    fragnment: fragnment,
    tokens: tokens,
    attr: getAttr(tokens),
    node: node,
    block: block,
    scope: getScope(),
    body: null,
  }));
}

function getBody(portion) {
//  if (protion.attr)
}

// 获取fragnment的属性（类型）
function getAttr(tokens) {
  console.log(tokens)
  switch (true) {
    case tokens[0] === 'endfor':
      return F_ATTR_ENDFOR;
    case tokens[0] === 'endif':
      return F_ATTR_ENDIF;
    case tokens.length === 0:
    case tokens.length === 1:
      return F_ATTR_VARI;
    case tokens[0] === 'for':
      return F_ATTR_FOR;
    case tokens[0] === 'if':
      return F_ATTR_IF;
    default:
      throw new Error(`token ${tokens} 不合法`);
  }
}

function getScope(subscope) {
  return baseScope;
}

function searchData(portion, path) {
//  return portion.scope.top.scope[portion.] 
  const paths = vari.split('.');
  const vari = paths[0];
  const obj =  portion.scope.search(vari);
  let cur = obj;
  paths.forEach(function(path, i) {
    cur = cur[path];
    if (cur === undefined) {
      throw new Error(`${path} is not exist`);
    }
  });
  return cur;
}

class Sue {
  constructor({
    el,
    data
  }) {
    this.root = el;
    this.data = data;
    this.scope = baseScope = new ScopeLink(this.data);

    this.created = arguments[0].created || function() {};
    this.rendered = arguments[0].rendered || function() {};

    this.created();
    traverse(this.root);
    this.render();
    this.rendered();
  }

  render() {
    let curPortion;
    while (curPortion = waitingToRenderPortion.shift()) {
      const data = curPortion.scope.top.scope[curPortion.fragnment];
      curPortion.node.data = data === undefined ? '' : data;
    }
  }
}

return Sue;

})()
