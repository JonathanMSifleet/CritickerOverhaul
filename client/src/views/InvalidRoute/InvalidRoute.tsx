import { FC } from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface IProps {
  path?: string;
}

const InvalidRoute: FC<IProps> = ({ path }) => {
  const [secondsRemaining, setSecondsRemaining] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    console.log(path);

    (async (): Promise<void> => {
      for (let i = 5; i > 0; i--) {
        setSecondsRemaining(i);
        await new Promise((resolve): NodeJS.Timeout => setTimeout(resolve, 1000));
      }
      navigate('/');
    })();
  }, []);

  return <p>This page does not exist, redirecting in {secondsRemaining} seconds</p>;
};

export default InvalidRoute;
