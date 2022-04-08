import { FC, useEffect, useState } from 'preact/compat';
import classes from './UserAvatar.module.scss';
import getUserAvatar from '../../../utils/getUserAvatar';
import Spinner from '../../../components/Spinner/Spinner';

interface IProps {
  username: string;
}

const UserAvatar: FC<IProps> = ({ username }) => {
  const [avatar, setAvatar] = useState(null as string | null);
  const [isLoadingAvatar, setIsLoadingAvatar] = useState(true);

  useEffect(() => {
    (async (): Promise<void> => {
      try {
        const result = await getUserAvatar(username);
        setAvatar(result.avatar);
      } finally {
        setIsLoadingAvatar(false);
      }
    })();
  }, []);

  return (
    <div className={classes.RatingAvatarWrapper}>
      {!isLoadingAvatar ? <img className={classes.RatingAvatar} src={avatar!} /> : <Spinner />}
    </div>
  );
};

export default UserAvatar;
