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

      const response = await getUserAvatar(UID);
      console.log('🚀 ~ file: Avatar.tsx ~ line 24 ~ getAvatar ~ response', response);
      setUserAvatar(response);

      setIsLoadingAvatar(false);
      setShouldLoadAvatar(false);
    };

    if (shouldLoadAvatar) getAvatar();
  }, [shouldLoadAvatar]);

  const convertImageToBase64 = (file: Blob): Promise<unknown> =>
    new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = (): void => resolve(fileReader.result);
      fileReader.onerror = (error): void => reject(error);
    });

  const uploadFile = async (image: string): Promise<void> => {
    const response = await httpRequest(`${endpoints.UPLOAD_USER_AVATAR}/${UID}`, 'POST', {
      image
    });
    console.log('response', response);
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
              onChange={async (event): Promise<void> => {
                const base64Image = await convertImageToBase64(event.target.files![0]);
                uploadFile(base64Image as string);
              }}
            />
          </label>
        </>
      ) : null}
    </div>
  );
};

export default Avatar;
