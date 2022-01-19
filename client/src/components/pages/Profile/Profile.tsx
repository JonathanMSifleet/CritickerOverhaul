import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { GET_PROFILE_BY_USERNAME, UPLOAD_USER_AVATAR } from '../../../constants/endpoints';
import { userInfoState } from '../../../store';
import getUserAvatar from '../../../utils/getUserAvatar';
import httpRequest from '../../../utils/httpRequest';
// @ts-expect-error cannot import as type
import FileBase64 from '../../elements/FileToBase64/build.min.js';
import Spinner from '../../elements/Spinner/Spinner';
import PageView from '../../hoc/PageView/PageView';
import classes from './Profile.module.scss';

const Profile: React.FC = (): JSX.Element => {
  const [isLoadingAvatar, setIsLoadingAvatar] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [userAvatar, setUserAvatar] = useState('');
  // todo
  const [userProfile, setUserProfile] = useState(null as unknown as any);
  const userState = useRecoilValue(userInfoState);

  const { username } = useParams<{ username: string }>();

  useEffect(() => {
    const loadUserProfile = async (username: string): Promise<void> => {
      setIsLoadingProfile(true);
      const profile = await httpRequest(`${GET_PROFILE_BY_USERNAME}/${username}`, 'GET');
      setIsLoadingProfile(false);

      setUserProfile(profile);
    };

    username ? loadUserProfile(username) : loadUserProfile(userState!.username);
  }, []);

  useEffect(() => {
    (async (): Promise<void> => {
      setIsLoadingAvatar(true);
      setUserAvatar(await getUserAvatar(userProfile.UID));
      setIsLoadingAvatar(false);
    })();
  }, [userProfile]);

  const handleFile = async (event: any): Promise<void> => {
    console.log('event', event);
    const { base64 } = event!;
    await httpRequest(`${UPLOAD_USER_AVATAR}/${userState!.UID}`, 'POST', { base64 });
  };

  const epochToDate = (epoch: number): string => new Date(epoch).toLocaleDateString('en-GB');

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
        {isLoadingProfile ? (
          <Spinner />
        ) : (
          <div className={classes.UserDetailsWrapper}>
            <div className={classes.ImageWrapper}>
              {isLoadingAvatar ? (
                <Spinner />
              ) : (
                <img className={classes.UserAvatar} src={userAvatar} />
              )}

              {!username && userState!.loggedIn ? (
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
              ) : null}
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
        )}
      </div>
    </PageView>
  );
};

export default Profile;
