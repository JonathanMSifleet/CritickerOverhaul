import colourGradient from 'javascript-color-gradient';

// @ts-expect-error setGradient does exist:
const colourArray = colourGradient.setGradient('#FF0000', '#FBFB13', '#228A00').setMidpoint(5);

export default colourArray;
