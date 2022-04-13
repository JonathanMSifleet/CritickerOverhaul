const epochToDate = (epoch: number, options?: { [key: string]: string }): string =>
  new Date(epoch).toLocaleDateString('en-GB', options);

export default epochToDate;
