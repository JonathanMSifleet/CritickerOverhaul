const extractValidationMessages = (errorMessage: string): { [key: string]: string }[] => {
  const validationMessages: { [key: string]: string }[] = [];

  errorMessage = errorMessage.toString().replace('Error: ', '');
  const messages = errorMessage.split('\n');

  messages.forEach((message) => {
    const words = message.split(' ');
    const key = words[0];

    const valMessage = words.slice(1, words.length).join(' ');

    validationMessages.push({ [key]: valMessage });
  });

  return validationMessages;
};

export default extractValidationMessages;
