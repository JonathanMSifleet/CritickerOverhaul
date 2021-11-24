import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ShrugSVG from '../../../assets/svg/Shrug.svg';
import Context from '../../../hooks/store/context';
import {
  getProfileByUsername,
  getUserAvatarURL
} from '../../../shared/constants/endpoints';
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
    if (username) {
      loadUserProfile(username);
    } else {
      loadUserProfile(globalState.userInfo.username);
    }
  }, []);

  // must use useEffect hook to use async functions
  // rather than returning await asyncFunc()
  useEffect(() => {
    async function getUserAvatar() {
      const response = await HTTPRequest(
        `${getUserAvatarURL}/${userData.UID}`,
        'get'
      );

      if (response) {
        setUserAvatar(response);
      } else {
        setUserAvatar(ShrugSVG);
      }
    }
    if (userData) {
      getUserAvatar();
    } else {
      setUserAvatar(ShrugSVG);
    }
  }, [userData]);

  const loadUserProfile = async (username: string) => {
    if (username) {
      setUserData(
        await HTTPRequest(`${getProfileByUsername}/${username}`, 'get')
      );
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleFile = async (_event: any) => {
    // const { base64 } = event;
    // await HTTPRequest(
    //   `${uploadUserAvatarURL}/${globalState.userInfo.UID}`,
    //   'post',
    //   { base64 }
    // );
  };

  const epochToDate = (epoch: number) => {
    return new Date(epoch).toLocaleDateString('en-GB');
  };

  const getRatingRank = (numRatings: number) => {
    if (numRatings < 10) {
      return 'Newbie';
    } else if (numRatings >= 10 && numRatings < 100) {
      return 'Flick Fan';
    } else if (numRatings >= 100 && numRatings < 500) {
      return 'Movie Buff';
    } else if (numRatings >= 500 && numRatings < 1000) {
      return 'Film Freak';
    } else if (numRatings >= 1000 && numRatings < 2500) {
      return 'Cinema Addict';
    } else if (numRatings >= 2500 && numRatings < 5000) {
      return 'Celluloid Junkie';
    } else if (numRatings >= 5000) {
      return 'Criticker Zealot';
    } else {
      return 'Error determining rank';
    }
  };

  return (
    <PageView>
      <div className={classes.PageWrapper}>
        <div className={classes.UserDetailsWrapper}>
          <div className={classes.ImageWrapper}>
            <img className={classes.UserAvatar} src={userAvatar} />
            {(() => {
              if (!username && globalState.userInfo.loggedIn) {
                return (
                  <>
                    <label
                      htmlFor="fileUpload"
                      className={classes.UploadPictureText}
                    >
                      Upload new picture
                    </label>
                    <FileBase64
                      className={classes.UploadPictureInput}
                      id="fileUpload"
                      onDone={(event: { target: any }) => handleFile(event)}
                      type={'file'}
                    />
                  </>
                );
              }
            })()}
          </div>

          {!userData ? (
            'User not found'
          ) : (
            <div className={classes.UserDetails}>
              <h1>{userData ? userData.username : 'Unknown'}</h1>
              <p>
                {getRatingRank(userData.numRatings)} - {userData.numRatings}{' '}
                Film Ratings
              </p>
              <p>
                Member since: {epochToDate(userData.memberSince).toString()}
              </p>
            </div>
          )}
        </div>
      </div>
    </PageView>
  );
};

export default Profile;
