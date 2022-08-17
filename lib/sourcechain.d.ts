import type EStree from "estree";
import { visitor } from "@peggyjs/eslint-parser";
export interface Location {
    source?: string;
    start: EStree.Position;
    offset: number;
}
/**
 * A mapped-source string.
 */
export default class SourceChain {
    private blocks;
    constructor();
    /**
     * Add a chunk of text to the chain.
     *
     * @param text The text to append.
     * @param origLoc Original location of the text.
     * @param origRange Original offsets of the text
     */
    add(text: visitor.AST.ValueNode | string, origLoc?: Location): void;
    /**
     * Concatenate all of the blocks together.
     *
     * @returns The full text of the generated file.
     */
    toString(): string;
    /**
     * Concatenate all of the blocks together, with debug information.
     *
     * @returns The debug text of the generated file.
     */
    toDebugString(): string;
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
    originalLocation(loc: EStree.Position): EStree.Position | null;
    /**
     * Compute the original offset for a generated offset.
     *
     * @param offset Offset in the generated file.
     * @returns Offset in the original file, or NaN if the offset is into
     *   boilerplate.
     */
    originalOffset(offset: number): number;
}
