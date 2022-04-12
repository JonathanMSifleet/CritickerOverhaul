import { FC } from 'preact/compat';
import { route } from 'preact-router';
import { useEffect, useState } from 'preact/hooks';

const InvalidRoute: FC = () => {
  const [secondsRemaining, setSecondsRemaining] = useState(5);

  useEffect(() => {
    (async (): Promise<void> => {
      for (let i = 5; i > 0; i--) {
        setSecondsRemaining(i);
        await new Promise((resolve): NodeJS.Timeout => setTimeout(resolve, 1000));
      }
      route('/');
    })();
  }, []);

  return <p>This page does not exist, redirecting in {secondsRemaining} seconds</p>;
};

export default InvalidRoute;
