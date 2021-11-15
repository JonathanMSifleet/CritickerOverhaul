import React, { useEffect } from 'react';
import PageView from '../../hoc/PageLayout/PageView/PageView';

const Profile: React.FC = (): JSX.Element => {
  useEffect(() => {
    const profile = new URLSearchParams(
      document.location.search.substring(1)
    ).get('profile');
    console.log(
      '🚀 ~ file: Profile.tsx ~ line 9 ~ useEffect ~ profile',
      profile
    );
  }, []);

  return <PageView>Implement profile</PageView>;
};

export default Profile;
