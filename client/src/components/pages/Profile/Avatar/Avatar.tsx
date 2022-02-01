import { FC, useEffect, useState } from 'react';
import getUserAvatar from '../../../../utils/getUserAvatar';
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

  // const handleFile = async (event: { base64: string }): Promise<void> => {
  //   const { base64 } = event!;
  //   const response = await httpRequest(`${endpoints.UPLOAD_USER_AVATAR}/${UID}`, 'POST', {
  //     base64
  //   });
  //   console.log('response', response);
  // };

  return (
    <div className={classes.ImageWrapper}>
      {!isLoadingAvatar ? <img className={classes.UserAvatar} src={userAvatar} /> : null}
      {username && loggedIn ? (
        <>
          {/* <FileBase64
            className={classes.UploadPictureInput}
            id="fileUpload"
            onDone={(event: { base64: string }): Promise<void> => handleFile(event)}
            type={'file'}
          /> */}
          <label htmlFor="fileUpload" className={classes.UploadPictureText}>
            Upload new picture
          </label>
        </>
      ) : null}
    </div>
  );
};

export default Avatar;
