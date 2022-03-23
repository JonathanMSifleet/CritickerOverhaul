const getCellColour = (columnIndex: number, cellIndex: number): { backgroundColor: string } =>
  columnIndex === 0
    ? { backgroundColor: cellIndex % 2 === 0 ? '#FBFBFB' : '#E5F3FF' }
    : { backgroundColor: cellIndex % 2 === 0 ? '#E5F3FF' : '#FBFBFB' };

export default getCellColour;
