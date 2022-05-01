import Gradient from 'javascript-color-gradient';

const getColourGradient = (value: number): string => {
  const colourArray = new Gradient().setColorGradient('#C70000', '#FBFB13', '#228A00');

  let colourIndex = Math.round(value / 10);
  if (colourIndex <= 0) colourIndex = 1;

  return colourArray.getColor(colourIndex);
};

export default getColourGradient;
