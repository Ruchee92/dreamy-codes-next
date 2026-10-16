/** Columns left empty on the last row at >= 1280 (3 columns), for the end cell (`.ow-end`) to fill. */
export const endSpan = (visible: number) => (3 - (visible % 3)) % 3;
