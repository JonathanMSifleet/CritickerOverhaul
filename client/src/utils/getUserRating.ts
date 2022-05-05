import * as endpoints from '../constants/endpoints';
import httpRequest from './httpRequest';
import IRating from '../../../shared/interfaces/IRating';

const getUserRating = async (username: string, id: number): Promise<null | IRating> => {
  const result = await httpRequest(`${endpoints.GET_USER_RATING}/${id}/${username}`, 'GET');

  return result.statusCode === 404 ? null : result;
};

export default getUserRating;
