/// <reference types="nativewind/types" />

/**
 * Module declaration for importing TrueType Font files (.ttf).
 * 
 * This allows TypeScript to understand and provide type-checking 
 * and autocompletion for .ttf file imports.
 */
declare module "*.ttf" {
    /**
     * The imported value is a string representing the path to the font file.
     * 
     * Example usage:
     * ```
     * import MyFont from '@/src/assets/fonts/MyFont.ttf';
     * ```
     */
    const value: string;

    export default value;
}
