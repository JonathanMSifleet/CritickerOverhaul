import importAvatars from './migration/importAvatars';

const uploadFile = (event: { target: { files: Blob[] } }): void => {
  try {
    const fileReader = new FileReader();

    fileReader.readAsText(event.target.files[0]);
    fileReader.onload = (): void => {
      try {
        importAvatars(JSON.parse(fileReader.result as string));
      } catch (error) {
        console.error(error);
      }
    };
  } catch (error) {
    console.error(error);
  }
};

export default uploadFile;
