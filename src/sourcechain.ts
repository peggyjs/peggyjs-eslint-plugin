// Poor person's source-map support.  We didn't need the actual format, we
// need it to be synchronous.  There are several opportunities for performance
// enhancement, if we find that it's needed.

import type EStree from "estree";
import dbg from "debug";
import { visitor } from "@peggyjs/eslint-parser";

const debug = dbg("eslintrc:@peggyjs/sourcechain");
const NEWLINES = /\r?\n/g;

// All lines start at 1.
// All columns start at 0.
// All offsets start at 0.

export interface Location {
  source?: string;
  start: EStree.Position;
  offset: number;
}

/**
 * One block of translated text.  Some blocks have a source location, others
 * are purely boilerplate.
 */
class Block {
  public text: string;

  public loc?: Location;

  public count: number;

  public tail: number;

  /**
   * Create a Block.
   *
   * @param text The generated text
   * @param loc The original location of text, if it has one.
   * @param range The original offset range of the text, if it has one.
   */
  public constructor(text: string, loc?: Location) {
    this.text = text;
    this.loc = loc;

    // There is always at least one item in the array, "" for empty strings.
    this.count = this.text.split(NEWLINES).length - 1;
    // "Complete" blocks end with a newline.
    // "Incomplete" blocks end with a tail of non-newlines.
    const match = this.text.match(/[^\r\n]*$/);
    this.tail = match
      ? match[0].length
      : /* c8 ignore next */ 0; // Always matches
  }

  public get line(): number {
    return this.loc?.start?.line ?? NaN;
  }

  public get column(): number {
    return this.loc?.start?.column ?? NaN;
  }
}

/**
 * A mapped-source string.
 */
export default class SourceChain {
  private blocks: Block[];

  public constructor() {
    /** @type {Block[]} */
    this.blocks = [];
  }

  /**
   * Add a chunk of text to the chain.
   *
   * @param text The text to append.
   * @param origLoc Original location of the text.
   * @param origRange Original offsets of the text
   */
  public add(text: visitor.AST.ValueNode | string, origLoc?: Location): void {
    if (typeof text === "string") {
      this.blocks.push(new Block(text, origLoc));
    } else {
      this.blocks.push(new Block(text.value, {
        source: text.loc.source || undefined, // Source might be null.
        start: text.loc.start,
        offset: text.range[0],
      }));
    }
  }

  /**
   * Concatenate all of the blocks together.
   *
   * @returns The full text of the generated file.
   */
  public toString(): string {
    return this.blocks.reduce((t, { text }) => t + text, "");
  }

  /**
   * Map a location in the generated file back to a location in the original
   * file.  Assumption: All input locations are valid, so there can't be
   * columns past the end of a line for example.
   *
   * @param loc The location in the generated file
   * @returns The corressponding location in the original file, or
   *   null if the text was boilerplate.
   * @throws Invalid location
   */
  public originalLocation(loc: EStree.Position): EStree.Position | null {
    if (!loc) {
      return null;
    }
    let line = 1;
    let col = 0;
    let flow = false;
    let prev: Block | null = null;

    debug("Looking for: %o", loc);
    for (const block of this.blocks) {
      debug("%d:%d Block: %o", line, col, block);
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
            // But it's in the generated section.
            // Maybe we're just past the end of the previous block?
            if (prev?.loc && !prev.tail && (loc.column === 0)) {
              return {
                line: prev.line + prev.count,
                column: 0,
              };
            }

            // Find the next non-generated section.
            flow = true;
            continue;
          }
          if (flow) {
            col = loc.column;
          }
          const ret = {
            line: block.line + lineOffset,
            column: lineOffset
              ? loc.column
              : block.column + loc.column - col,
          };
          return ret;
        }
      }
      line = nextLine;
      prev = block;
    }
    return null;
  }

  /**
   * Compute the original offset for a generated offset.
   *
   * @param offset Offset in the generated file.
   * @returns Offset in the original file, or NaN if the offset is into
   *   boilerplate.
   */
  public originalOffset(offset: number): number {
    let cur = 0;
    for (const block of this.blocks) {
      const nextOffset = cur + block.text.length;
      if (offset < nextOffset) {
        if (!block.loc) {
          return NaN;
        }
        return block.loc.offset + offset - cur;
      }
      cur = nextOffset;
    }
    throw new Error(`Invalid offset: ${offset}`);
  }
}
