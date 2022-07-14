"use strict";

// Poor person's source-map support.  We didn't need the actual format, we
// need it to be synchronous.  There are several opportunities for performance
// enhancement, if we find that it's needed.

/**
 * @typedef {Object} Loc line/column location.
 * @property {number} line Line number, 1-based.
 * @property {number} column Column number, 1-based.
 */

/**
 * One block of translated text.  Some blocks have a source location, others
 * are purely boilerplate.
 */
class Block {
  /**
   * Create a Block.
   *
   * @param {string} text The generated text
   * @param {Loc} [loc] The original location of
   *   text, if it has one.
   */
  constructor(text, loc) {
    this.text = text;
    /** @type {Loc|undefined} */
    this.loc = loc;
    // There is always at least one item in the array, "" for empty strings.
    this.count = text.split(/\r?\n/g).length - 1;
    // "Complete" blocks end with a newline.
    // "Incomplete" blocks end with a tail of non-newlines.
    const match = text.match(/[^\r\n]*$/);
    this.tail = match ? match[0].length : 0;
  }
}

/**
 * A mapped-source string.
 */
class SourceChain {
  constructor() {
    /** @type {Block[]} */
    this.blocks = [];
  }

  /**
   * Add a chunk of text to the chain.
   *
   * @param {string} text The text to append.
   * @param {Loc} [origLoc] Original location of the
   *   text.
   */
  add(text, origLoc) {
    this.blocks.push(new Block(text, origLoc));
  }

  /**
   * Concatenate all of the blocks together.
   *
   * @returns {string} The full text of the generated file.
   */
  toString() {
    return this.blocks.reduce((t, { text }) => t + text, "");
  }

  /**
   * Map a location in the generated file back to a location in the original
   * file.  Assumption: All input locations are valid, so there can't be
   * columns past the end of a line for example.
   *
   * @param {Loc} loc The location in the generated file
   * @returns {Loc|null} The corressponding location in the original file, or
   *   null if the text was boilerplate.
   */
  originalLocation(loc) {
    if (!loc || (typeof loc.line !== "number") || (typeof loc.column !== "number")) {
      return loc;
    }
    let line = 1;
    let col = 0;
    for (const block of this.blocks) {
      const nextLine = line + block.count;
      if (block.tail ? loc.line <= nextLine : loc.line < nextLine) {
        // Found the right block, unless it's incomplete and we're past the
        // end of the last line.
        const lineOffset = loc.line - line;
        if (block.tail
            && (block.count === lineOffset)
            && (loc.column > col + block.tail)) {
          // Move over by the last line of the incomplete bock
          col += block.tail;
        } else {
          // Now we're sure we've got the right block
          if (!block.loc) {
            return null;
          }
          const ret = {
            line: block.loc.line + lineOffset,
            column: lineOffset
              ? loc.column
              : block.loc.column + loc.column - col - 1,
          };
          return ret;
        }
      }
      line = nextLine;
    }
    throw new Error(`Invalid location: ${JSON.stringify(loc)}`);
  }
}

module.exports = SourceChain;
