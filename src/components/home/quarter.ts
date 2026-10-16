// Calendar quarters: Jan-Mar is Q1 ... Oct-Dec is Q4. Computed at render, so
// the static page picks the change up on its next revalidation.
export const currentQuarter = () => `Q${Math.floor(new Date().getMonth() / 3) + 1}`;
