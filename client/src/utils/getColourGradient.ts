import colourArray from '../constants/colourArray';

const getColourGradient = (ratingPercentile: number): string => {
  let colourIndex = Math.round(ratingPercentile / 10);
  if (colourIndex <= 0) colourIndex = 1;

  return colourArray.getColor(colourIndex);
};

export default getColourGradient;
