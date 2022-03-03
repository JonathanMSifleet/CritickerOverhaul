import Compress from 'compress.js';
import { FC, useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import * as endpoints from '../../../../constants/endpoints';
import { userInfoState } from '../../../../store';
import getUserAvatar from '../../../../utils/getUserAvatar';
import httpRequest from '../../../../utils/httpRequest';
import classes from './Avatar.module.scss';

interface IProps {
  shouldLoadAvatar: boolean;
  setShouldLoadAvatar: (val: boolean) => void;
  username: string;
}

const Avatar: FC<IProps> = ({ setShouldLoadAvatar, shouldLoadAvatar, username }) => {
  const [isLoadingAvatar, setIsLoadingAvatar] = useState(false);
  const [userAvatar, setUserAvatar] = useState('');
  const userState = useRecoilValue(userInfoState);

  useEffect(() => {
    const getAvatar = async (): Promise<void> => {
      setIsLoadingAvatar(true);

      try {
        setUserAvatar(username ? await getUserAvatar(username) : userState.avatar);
      } catch (e) {
        console.error(e);
      }

      setIsLoadingAvatar(false);
      setShouldLoadAvatar(false);
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
      {
        image: newImage
      }
    );
  };

  return (
    <div className={classes.ImageWrapper}>
      {!isLoadingAvatar && (username || userState.loggedIn) ? (
        <img className={classes.UserAvatar} src={userAvatar} />
      ) : null}

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
