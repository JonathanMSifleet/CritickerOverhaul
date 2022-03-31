import * as endpoints from '../constants/endpoints';

import IUserState from '../interfaces/IUserState';
import ShrugSVG from '../assets/svg/Shrug.svg';
import httpRequest from './httpRequest';

const getUserAvatar = async (username: string, userState: IUserState): Promise<string> => {
  if (process.env.SAVE_MONEY) return ShrugSVG;
  if (username === undefined) return userState.avatar !== undefined ? userState.avatar : ShrugSVG;

  const url = `${endpoints.GET_USER_AVATAR}/${username === '' ? userState.username : username}`;
  const response = await httpRequest(url, 'GET');

  return response.statusCode === 404 ? ShrugSVG : response;
};

export default getUserAvatar;
