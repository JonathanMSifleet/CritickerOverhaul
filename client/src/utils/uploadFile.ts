import aggregatePercentiles from './migration/aggregatePercentiles';

const uploadFile = (event: { target: { files: FileList } }): void => {
  try {
    const fileReader = new FileReader();

    fileReader.readAsText(event.target.files[0]);
    fileReader.onload = (): void => {
      try {
        aggregatePercentiles(JSON.parse(fileReader.result as string));
      } catch (error) {
        console.error(error);
      }
    };
  } catch (error) {
    console.error(error);
  }
};

export default uploadFile;
