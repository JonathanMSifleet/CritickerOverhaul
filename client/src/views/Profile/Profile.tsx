import { FC, useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import FileSelector from '../../components/FileSelector/FileSelector';
import PageView from '../../components/PageView/PageView';
import Spinner from '../../components/Spinner/Spinner';
import * as endpoints from '../../constants/endpoints';
import { userInfoState } from '../../store';
import httpRequest from '../../utils/httpRequest';
import Avatar from './Avatar/Avatar';
import classes from './Profile.module.scss';
import UpdateUserDetailsForm from './UpdateUserDetailsForm/UpdateUserDetailsForm';

interface IUrlParams {
  path?: string;
  username?: string;
}

const Profile: FC<IUrlParams> = ({ username }): JSX.Element => {
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [shouldLoadAvatar, setShouldLoadAvatar] = useState(false);
  const [showUpdateDetailsForm, setShowUpdateDetailsForm] = useState(false);
  // todo
  const [userProfile, setUserProfile] = useState(null as unknown as any);
  const userState = useRecoilValue(userInfoState);

  useEffect(() => {
    const loadUserProfile = async (username: string): Promise<void> => {
      setIsLoadingProfile(true);

      try {
        setUserProfile(
          await httpRequest(`${endpoints.GET_PROFILE_BY_USERNAME}/${username}`, 'GET')
        );
        setShouldLoadAvatar(true);
      } catch (error) {
        console.error(error);
      }

      setIsLoadingProfile(false);
    };

    if (username) {
      loadUserProfile(username);
    } else if (userState.username !== '') {
      loadUserProfile(userState.username);
    }
  }, [username]);

  const epochToDate = (epoch: number): string => new Date(epoch).toLocaleDateString('en-GB');

  const getRatingRank = (numRatings: number): string => {
    switch (true) {
      case numRatings < 10:
        return 'newbie';
      case numRatings < 100:
        return 'flick fan';
      case numRatings < 500:
        return 'movie buff';
      case numRatings < 1000:
        return 'film freak';
      case numRatings < 2500:
        return 'cinema addict';
      case numRatings < 5000:
        return 'celluloid junkie';
      case numRatings >= 5000:
        return 'criticker zealot';
      default:
        return 'Error determining rank';
    }
  };

  return (
    <PageView backgroundCSS={classes.PageWrapper}>
      {!isLoadingProfile ? (
        <>
          <Avatar
            setShouldLoadAvatar={setShouldLoadAvatar}
            shouldLoadAvatar={shouldLoadAvatar}
            username={username!}
          />

          {userProfile ? (
            <div className={classes.UserDetails}>
              <h1 className={classes.UsernameHeader}>
                {userProfile.username}
                <span className={classes.UserRank}> {getRatingRank(userProfile.numRatings)}</span>
              </h1>
              <p className={classes.UserProfileText}>{userProfile.numRatings} Film Ratings</p>
              <p className={classes.UserProfileText}>
                <b>Member since:</b> {epochToDate(userProfile.memberSince)}
              </p>
              <p
                className={classes.UserProfileLink}
                onClick={(): void => setShowUpdateDetailsForm(true)}
              >
                Update Personal Information
              </p>
              {/* to do: */}
              {showUpdateDetailsForm ? <UpdateUserDetailsForm /> : null}
              <FileSelector text={'Import Criticker Ratings'} />
            </div>
          ) : (
            'User not found'
          )}
        </>
      ) : (
        <Spinner />
      )}
    </PageView>
  );
};

export default Profile;
