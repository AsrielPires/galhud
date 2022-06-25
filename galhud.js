const { S, css } = require("galho");
const { ex } = require("inutil");

const gr = require("./grid");
const tb = require("./table");
const tr = require("./tree");
const li = require("./list");

ex(exports, gr);
ex(exports, tb);
ex(exports, tr);
ex(exports, li);
/**
 * @param tag {S<HTMLStyleElement>} 
 * @returns {S<HTMLStyleElement>} 
 **/
exports.style = function () {
  return {
    ...gr.style(),
    ...tb.style(),
    ...tr.style(),
    ...li.style()
  }
}