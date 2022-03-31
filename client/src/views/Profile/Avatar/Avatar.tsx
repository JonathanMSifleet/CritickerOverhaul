import * as endpoints from '../../../constants/endpoints';

import { FC, useEffect, useState } from 'react';

import Compress from 'compress.js';
import IUserState from './../../../interfaces/IUserState';
import { SetterOrUpdater } from 'recoil';
import Spinner from '../../../components/Spinner/Spinner';
import classes from './Avatar.module.scss';
import getUserAvatar from '../../../utils/getUserAvatar';
import httpRequest from '../../../utils/httpRequest';

interface IProps {
  shouldLoadAvatar: boolean;
  setShouldLoadAvatar: (val: boolean) => void;
  setUserInfo: SetterOrUpdater<IUserState>;
  username: string;
  userState: IUserState;
}

const Avatar: FC<IProps> = ({ setShouldLoadAvatar, shouldLoadAvatar, setUserInfo, username, userState }) => {
  const [isLoadingAvatar, setIsLoadingAvatar] = useState(false);
  const [userAvatar, setUserAvatar] = useState('');

  useEffect(() => {
    const getAvatar = async (): Promise<void> => {
      setIsLoadingAvatar(true);

      try {
        setUserAvatar(await getUserAvatar(username, userState));
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
