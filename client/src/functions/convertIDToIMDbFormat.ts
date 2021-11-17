const convertIDToIMDbFormat = (type: string, id: string): string => {
  const zerosToPrepend = 7 - id.toString().length;
  for (let i = 0; i < zerosToPrepend; i++) {
    id = '0' + id;
  }

  if (type === 'film') {
    return 'tt' + id;
  } else {
    return 'nm' + id;
  }
};

export default convertIDToIMDbFormat;
