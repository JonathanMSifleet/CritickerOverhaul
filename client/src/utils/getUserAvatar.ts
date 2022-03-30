import * as endpoints from '../constants/endpoints';

import ShrugSVG from '../assets/svg/Shrug.svg';
import httpRequest from './httpRequest';

const getUserAvatar = async (username: string): Promise<string> => {
  if (process.env.SAVE_MONEY) return ShrugSVG;

  const response = await httpRequest(`${endpoints.GET_USER_AVATAR}/${username}`, 'GET');

  return response.statusCode === 404 ? ShrugSVG : response;
};

export default getUserAvatar;
