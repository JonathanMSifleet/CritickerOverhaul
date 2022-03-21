import * as endpoints from '../../constants/endpoints';

import { FC, useEffect, useState } from 'react';

import PageView from '../../components/PageView/PageView';
import Spinner from '../../components/Spinner/Spinner';
import httpRequest from '../../utils/httpRequest';
import { useRecoilValue } from 'recoil';
import { userInfoState } from '../../store';

interface IUrlParams {
  path?: string;
  username?: string;
}

const Ratings: FC<IUrlParams> = ({ username }) => {
  const [isLoadingRatings, setIsLoadingRatings] = useState(false);
  const userState = useRecoilValue(userInfoState);

  useEffect(() => {
    (async (): Promise<void> => {
      setIsLoadingRatings(true);

      let localUsername;
      if (username) {
        localUsername = username;
      } else if (userState.username !== '') {
        localUsername = userState.username;
      }

      try {
        const result = await httpRequest(`${endpoints.GET_ALL_RATINGS}/${localUsername}`, 'GET');
        console.log('🚀 ~ file: Ratings.tsx ~ line 33 ~ result', result);
      } catch (error) {
      } finally {
        setIsLoadingRatings(false);
      }
    })();
  }, [username]);

  return <PageView>{!isLoadingRatings ? <></> : <Spinner />}</PageView>;
};

export default Ratings;
