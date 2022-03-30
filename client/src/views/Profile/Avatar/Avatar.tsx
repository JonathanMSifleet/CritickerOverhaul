import * as endpoints from '../../../constants/endpoints';

import { FC, useEffect, useState } from 'react';

import Compress from 'compress.js';
import IUserState from './../../../interfaces/IUserState';
import Spinner from '../../../components/Spinner/Spinner';
import classes from './Avatar.module.scss';
import getUserAvatar from '../../../utils/getUserAvatar';
import httpRequest from '../../../utils/httpRequest';

interface IProps {
  shouldLoadAvatar: boolean;
  setShouldLoadAvatar: (val: boolean) => void;
  username: string;
  userState: IUserState;
}

const Avatar: FC<IProps> = ({ setShouldLoadAvatar, shouldLoadAvatar, username, userState }) => {
  const [isLoadingAvatar, setIsLoadingAvatar] = useState(false);
  const [userAvatar, setUserAvatar] = useState('');

  useEffect(() => {
    const getAvatar = async (): Promise<void> => {
      setIsLoadingAvatar(true);

      try {
        setUserAvatar(username ? await getUserAvatar(username) : userState.avatar!);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoadingAvatar(false);
        setShouldLoadAvatar(false);
      }
    };

    if (shouldLoadAvatar) getAvatar();
  }, [shouldLoadAvatar]);

  const uploadFile = async (image: File): Promise<void> => {
    const resizedImage = await new Compress().compress([image], {
      maxHeight: 540,
      maxWidth: 540,
      quality: 1,
      size: 0.3
    });

    const newImage = `${resizedImage[0].prefix}${resizedImage[0].data}`;

    await httpRequest(
      `${endpoints.UPLOAD_USER_AVATAR}/${username ? username : userState.username}`,
      'POST',
      true,
      userState.accessToken,
      {
        image: newImage
      }
    );
  };

  return (
    <div className={classes.ImageWrapper}>
      {!isLoadingAvatar && (username || userState.loggedIn) ? (
        <img className={classes.UserAvatar} src={userAvatar} />
      ) : (
        <Spinner />
      )}

      {!username && userState.loggedIn ? (
        <>
          <label className={classes.UploadPictureText}>
            Upload new picture
            <input
              className={classes.UploadPictureInput}
              type="file"
              onChange={async (event): Promise<void> => uploadFile(event.target.files![0])}
            />
          </label>
        </>
      ) : null}
    </div>
  );
};

export default Avatar;
