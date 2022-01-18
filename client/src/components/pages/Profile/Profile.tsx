import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import ShrugSVG from '../../../assets/svg/Shrug.svg';
import { userInfoState } from '../../../recoilStore/store';
import { GET_PROFILE_BY_USERNAME, GET_USER_AVATAR, UPLOAD_USER_AVATAR } from '../../../shared/constants/endpoints';
import HTTPRequest from '../../../shared/functions/HTTPRequest';
import FileBase64 from '../../FileToBase64/build.min.js';
import PageView from '../../hoc/PageView/PageView';
import classes from './Profile.module.scss';

const Profile: React.FC = (): JSX.Element => {
  const [userAvatar, setUserAvatar] = useState('');
  const [userProfile, setUserProfile] = useState(null as unknown as any);
  // @ts-expect-error
  const [userState, setUserState] = useRecoilState(userInfoState);

  const { username } = useParams<{ username: string }>();

  useEffect(() => {
    const loadUserProfile = async (username: string): Promise<void> => {
      setUserProfile(await HTTPRequest(`${GET_PROFILE_BY_USERNAME}/${username}`, 'GET'));
    };

    username ? loadUserProfile(username) : loadUserProfile(userState!.username);
  }, []);

  // must use useEffect hook to use async functions
  // rather than returning await asyncFunc()
  useEffect(() => {
    const getUserAvatar = async (): Promise<void> => {
      const url = `${GET_USER_AVATAR}/${userProfile.UID}`;
      console.log(url);
      const response = await HTTPRequest(url, 'GET');

      console.log('profile response', response);

      // @ts-expect-error
      response.status === 404 ? setUserAvatar(ShrugSVG) : setUserAvatar(response);
    };

    userProfile ? getUserAvatar() : setUserAvatar(ShrugSVG);
  }, [userProfile]);

  const handleFile = async (event: any): Promise<void> => {
    console.log(event);
    const { base64 } = event!;
    await HTTPRequest(`${UPLOAD_USER_AVATAR}/${userState!.UID}`, 'POST', { base64 });
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
              if (!username && userState!.loggedIn) {
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

          {!userProfile ? (
            'User not found'
          ) : (
            <div className={classes.UserDetails}>
              <h1>{userProfile ? userProfile.username : 'Unknown'}</h1>
              <p>
                {getRatingRank(userProfile.numRatings)} - {userProfile.numRatings} Film Ratings
              </p>
              <p>Member since: {epochToDate(userProfile.memberSince)}</p>
            </div>
          )}
        </div>
      </div>
    </PageView>
  );
};

export default Profile;
