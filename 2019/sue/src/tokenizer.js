const T_TYPE_STRING = 1;
const T_TYPE_BOOLEAN = 2;
const T_TYPE_UNDEFINED = 3;
const T_TYPE_VARI = 4;
const T_TYPE_NULL = 5;
const T_TYPE_OPERATION = 6;
const T_TYPE_IF = 7;
const T_TYPE_FOR = 8;

function getTokens(fragnment) {
  let tokens = [];
  for (let i = 0; i < fragnment.length; i++) {
    let c = fragnment[i];
    let temp = [];
    switch(true) {
      case '\\' === c:
        temp.push(fragnment[++i]);
        break;
      case '\'' === c:
      case '"' === c:
      case ' ' === c:
        break;
      case '=' === c:
      case '|' === c:
      case '&' === c:
      case '>' === c || '<' === c || '+' === c || '-' === c || '*' === c || '/' === c:
      case 'u' === c:
      case 'n' === c:
      case 'i' === c:
      case 'f' === c:
      case /\w/.test(c):
    }
  }
  return tokens;
}

if (module && module.exports) {
  module.exports = getTokens;
}
