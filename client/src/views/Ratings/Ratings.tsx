import * as endpoints from '../../constants/endpoints';

import { FC, useEffect, useState } from 'react';

import PageView from '../../components/PageView/PageView';
import Spinner from '../../components/Spinner/Spinner';
import httpRequest from '../../utils/httpRequest';
import { stringify } from 'query-string';
import { useRecoilValue } from 'recoil';
import { userInfoState } from '../../store';

interface IUrlParams {
  path?: string;
  username?: string;
}

interface IAttributeValue {
  [key: string]: string | number;
}

const Ratings: FC<IUrlParams> = ({ username }) => {
  const [isLoadingRatings, setIsLoadingRatings] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [lastEvaluatedKey, setLastEvaluatedKey] = useState({
    imdb_title_id: 79470,
    rating: 6,
    username: 'jonathanmsifleet'
  } as IAttributeValue);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_results, setResults] = useState(null as any);
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
        const result =
          lastEvaluatedKey === undefined
            ? await httpRequest(`${endpoints.GET_ALL_RATINGS}/${localUsername}`, 'GET')
            : await httpRequest(`${endpoints.GET_ALL_RATINGS}/${localUsername}/${stringify(lastEvaluatedKey)}`, 'GET');

        console.log('🚀 ~ file: Ratings.tsx ~ line 37 ~ result', result);

        setLastEvaluatedKey(result.lastEvaluatedKey);
        setResults(result.results);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoadingRatings(false);
      }
    })();
  }, [username]);

  return <PageView>{!isLoadingRatings ? <></> : <Spinner />}</PageView>;
};

export default Ratings;
