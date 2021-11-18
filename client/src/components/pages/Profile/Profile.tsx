import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ShrugSVG from '../../../assets/svg/Shrug.svg';
import Context from '../../../hooks/store/context';
import {
  getProfileByUsername,
  getUserAvatarURL
} from '../../../shared/endpoints';
import PageView from '../../hoc/PageLayout/PageView/PageView';
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
      console.log(globalState);
      loadUserProfile(globalState.userInfo.username);
    }
  }, []);

  const loadUserProfile = async (username: string) => {
    let result = await fetch(`${getProfileByUsername}/${username}`, {
      method: 'get'
    });
    result = await result.json();
    setUserData(result);
  };

  // must use useEffect hook to use async functions
  // rather than returning await asyncFunc()
  useEffect(() => {
    async function getUserAvatar() {
      let response = (await fetch(`${getUserAvatarURL}/${userData.UID}`, {
        method: 'get'
      })) as any;
      response = await response.json();

      if (response.statusCode === 404) {
        setUserAvatar(ShrugSVG);
      } else {
        setUserAvatar(response);
      }
    }
    if (userData) getUserAvatar();
  }, [userData]);

  return (
    <PageView>
      <div className={classes.PageWrapper}>
        {!userData ? (
          'Not found'
        ) : (
          <div className={classes.UserDetailsWrapper}>
            <img className={classes.UserAvatar} src={userAvatar} />
            {!userData ? (
              'Not found'
            ) : (
              <div className={classes.UserDetails}>
                <h1>{userData ? userData.username : 'Unknown'}</h1>
              </div>
            )}
          </div>
        )}
      </div>
    </PageView>
  );
};

export default Profile;
