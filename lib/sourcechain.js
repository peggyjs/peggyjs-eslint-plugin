"use strict";
// Poor person's source-map support.  We didn't need the actual format, we
// need it to be synchronous.  There are several opportunities for performance
// enhancement, if we find that it's needed.
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const debug_1 = __importDefault(require("debug"));
const debug = (0, debug_1.default)("eslintrc:@peggyjs/sourcechain");
const NEWLINES = /\r?\n/g;
/**
 * One block of translated text.  Some blocks have a source location, others
 * are purely boilerplate.
 */
class Block {
    /**
     * Create a Block.
     *
     * @param text The generated text
     * @param loc The original location of text, if it has one.
     * @param range The original offset range of the text, if it has one.
     */
    constructor(text, loc) {
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
    get line() {
        return this.loc?.start?.line ?? NaN;
    }
    get column() {
        return this.loc?.start?.column ?? NaN;
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
     * @param text The text to append.
     * @param origLoc Original location of the text.
     * @param origRange Original offsets of the text
     */
    add(text, origLoc) {
        if (typeof text === "string") {
            this.blocks.push(new Block(text, origLoc));
        }
        else {
            this.blocks.push(new Block(text.value, {
                source: text.loc.source || undefined,
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
    toString() {
        return this.blocks.reduce((t, { text }) => t + text, "");
    }
    /**
     * Concatenate all of the blocks together, with debug information.
     *
     * @returns The debug text of the generated file.
     */
    toDebugString() {
        return this.blocks.reduce((t, block) => {
            if (block.loc) {
                return `${t}[${block.loc.start.line},${block.loc.start.column} ${block.loc.offset}:${block.count},${block.tail}]${block.text}`;
            }
            return `${t}[:${block.count},${block.tail}]${block.text}`;
        }, "");
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
    originalLocation(loc) {
        if (!loc) {
            return null;
        }
        let line = 1;
        let col = 0;
        let flow = false;
        let prev = null;
        debug("Looking for: %o", loc);
        for (const block of this.blocks) {
            debug("%d,%d: %o", line, col, block);
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
                }
                else {
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
    originalOffset(offset) {
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
exports.default = SourceChain;
