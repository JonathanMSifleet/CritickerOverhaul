import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ShrugSVG from '../../../assets/svg/Shrug.svg';
import Context from '../../../hooks/store/context';
import { GET_PROFILE_BY_USERNAME, GET_USER_AVATAR, UPLOAD_USER_AVATAR } from '../../../shared/constants/endpoints';
import HTTPRequest from '../../../shared/functions/HTTPRequest';
// @ts-expect-error
import FileBase64 from '../../FileToBase64/build.min.js';
import PageView from '../../hoc/PageView/PageView';
import classes from './Profile.module.scss';

const Profile: React.FC = (): JSX.Element => {
  const [userData, setUserData] = useState(null as unknown as any);
  const [userAvatar, setUserAvatar] = useState('');

  const { username } = useParams<{ username: string }>();
  const { globalState } = useContext(Context);

  useEffect(() => {
    username ? loadUserProfile(username) : loadUserProfile(globalState.userInfo.username);
  }, []);

  // must use useEffect hook to use async functions
  // rather than returning await asyncFunc()
  useEffect(() => {
    const getUserAvatar = async (): Promise<void> => {
      const url = `${GET_USER_AVATAR}/${userData.UID}`;
      console.log(url);
      const response = await HTTPRequest(url, 'GET');

      console.log('profile response', response);

      // @ts-expect-error
      if (response.status === 404) {
        setUserAvatar(ShrugSVG);
      } else {
        // @ts-expect-error
        setUserAvatar(response);
      }
    };

    userData ? getUserAvatar() : setUserAvatar(ShrugSVG);
  }, [userData]);

  const loadUserProfile = async (username: string): Promise<void> => {
    if (username) setUserData(await HTTPRequest(`${GET_PROFILE_BY_USERNAME}/${username}`, 'GET'));
  };

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const handleFile = async (_event: any): Promise<void> => {
    console.log(event);
    // @ts-expect-error
    const { base64 } = event!;
    await HTTPRequest(`${UPLOAD_USER_AVATAR}/${globalState.userInfo.UID}`, 'POST', { base64 });
  };

  const epochToDate = (epoch: number): string => {
    return new Date(epoch).toLocaleDateString('en-GB');
  };

  const getRatingRank = (numRatings: number): string => {
    switch (true) {
      case numRatings < 10:
        return 'Newbie';
      case numRatings < 100:
        return 'Flick Fan';
      case numRatings < 500:
        return 'Movie Buff';
      case numRatings < 1000:
        return 'Film Freak';
      case numRatings < 2500:
        return 'Cinema Addict';
      case numRatings < 5000:
        return 'Celluloid Junkie';
      case numRatings >= 5000:
        return 'Criticker Zealot';
      default:
        return 'Error determining rank';
    }
  };

  return (
    <PageView>
      <div className={classes.PageWrapper}>
        <div className={classes.UserDetailsWrapper}>
          <div className={classes.ImageWrapper}>
            <img className={classes.UserAvatar} src={userAvatar} />
            {((): JSX.Element | null => {
              if (!username && globalState.userInfo.loggedIn) {
                return (
                  <>
                    <label htmlFor="fileUpload" className={classes.UploadPictureText}>
                      Upload new picture
                    </label>
                    <FileBase64
                      className={classes.UploadPictureInput}
                      id="fileUpload"
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      onDone={(event: { target: any }): Promise<void> => handleFile(event)}
                      type={'file'}
                    />
                  </>
                );
              } else return null;
            })()}
          </div>

          {!userData ? (
            'User not found'
          ) : (
            <div className={classes.UserDetails}>
              <h1>{userData ? userData.username : 'Unknown'}</h1>
              <p>
                {getRatingRank(userData.numRatings)} - {userData.numRatings} Film Ratings
              </p>
              <p>Member since: {epochToDate(userData.memberSince).toString()}</p>
            </div>
          )}
        </div>
      </div>
    </PageView>
  );
};

export default Profile;
