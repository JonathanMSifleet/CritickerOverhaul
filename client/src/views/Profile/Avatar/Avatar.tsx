import * as endpoints from '../../../constants/endpoints';
import { FC, useState } from 'react';
import { SetterOrUpdater } from 'recoil';
import { useEffect } from 'preact/hooks';
import classes from './Avatar.module.scss';
import Compress from 'compress.js';
import httpRequest from '../../../utils/httpRequest';
import IUserState from './../../../interfaces/IUserState';
import ShrugSVG from '../../../assets/svg/Shrug.svg';
import Spinner from '../../../components/Spinner/Spinner';

interface IProps {
  avatar: string;
  setUserInfo: SetterOrUpdater<IUserState>;
  username: string;
  userState: IUserState;
}

const Avatar: FC<IProps> = ({ avatar, setUserInfo, username, userState }) => {
  const [userAvatar, setUserAvatar] = useState(avatar);

  useEffect(() => {
    if (avatar === undefined) setUserAvatar(ShrugSVG);
  }, []);

  const uploadAvatar = async (image: File): Promise<void> => {
    const resizedImage = await new Compress().compress([image], {
      maxHeight: 480,
      maxWidth: 480,
      quality: 1,
      size: 0.3
    });

    const newImage = `${resizedImage[0].prefix}${resizedImage[0].data}`;

    try {
      const result = await httpRequest(
        `${endpoints.UPLOAD_USER_AVATAR}/${userState.username}`,
        'POST',
        userState.accessToken,
        {
          image: newImage
        }
      );

      if (result.statusCode === 401) throw new Error('Invalid access token');

      setUserInfo({ ...userState, avatar: newImage });
      setUserAvatar(newImage);

      alert('Successfully updated your avatar');
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div className={classes.ImageWrapper}>
      {username || userState.loggedIn ? <img className={classes.UserAvatar} src={userAvatar} /> : <Spinner />}

      {!username && userState.loggedIn ? (
        <>
          <label className={classes.UploadPictureText}>
            Upload new picture
            <input
              className={classes.UploadPictureInput}
              type="file"
              onChange={async (event): Promise<void> => uploadAvatar(event.target.files![0])}
            />
          </label>
        </>
      ) : null}
    </div>
  );
};

export default Avatar;
