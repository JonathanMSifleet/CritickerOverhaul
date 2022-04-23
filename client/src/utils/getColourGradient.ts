import colourGradient from 'javascript-color-gradient';

// @ts-expect-error setGradient does exist:
const colourArray = colourGradient.setGradient('#C70000', '#FBFB13', '#228A00');

const getColourGradient = (value: number): string => {
  let colourIndex = Math.round(value / 10);
  if (colourIndex <= 0) colourIndex = 1;

  return colourArray.getColor(colourIndex);
};

export default getColourGradient;
