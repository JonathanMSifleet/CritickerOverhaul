import Compress from 'compress.js';
import { FC, useEffect, useState } from 'react';
import * as endpoints from '../../../../constants/endpoints';
import getUserAvatar from '../../../../utils/getUserAvatar';
import httpRequest from '../../../../utils/httpRequest';
import classes from './Avatar.module.scss';

interface IProps {
  loggedIn: boolean;
  shouldLoadAvatar: boolean;
  setShouldLoadAvatar: (val: boolean) => void;
  UID: string;
  username: string;
}

const Avatar: FC<IProps> = ({ loggedIn, UID, setShouldLoadAvatar, shouldLoadAvatar, username }) => {
  const [isLoadingAvatar, setIsLoadingAvatar] = useState(false);
  const [userAvatar, setUserAvatar] = useState('');

  useEffect(() => {
    const getAvatar = async (): Promise<void> => {
      setIsLoadingAvatar(true);

      setUserAvatar(await getUserAvatar(UID));

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

    await httpRequest(`${endpoints.UPLOAD_USER_AVATAR}/${UID}`, 'POST', {
      image: newImage
    });
  };

  return (
    <div className={classes.ImageWrapper}>
      {!isLoadingAvatar ? <img className={classes.UserAvatar} src={userAvatar} /> : null}
      {username && loggedIn ? (
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
