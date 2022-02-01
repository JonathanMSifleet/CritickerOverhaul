const convertIDToIMDbFormat = (type: string, id: number): string => {
  let formattedID = id.toString();

  if (formattedID.length < 7) {
    const zerosToPrepend = 7 - formattedID.toString().length;
    for (let i = 0; i < zerosToPrepend; i++) {
      formattedID = '0' + formattedID;
    }
  }

  return type === 'film' ? 'tt' + id : 'nm' + id;
};

export default convertIDToIMDbFormat;
