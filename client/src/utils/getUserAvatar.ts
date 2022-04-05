import * as endpoints from '../constants/endpoints';

import httpRequest from './httpRequest';
import IUserState from '../interfaces/IUserState';
import ShrugSVG from '../assets/svg/Shrug.svg';

const getUserAvatar = async (
  username: string | undefined,
  userState: IUserState | undefined
): Promise<{ username: string; avatar: string }> => {
  if (username === undefined) return userState!.avatar !== undefined ? userState!.avatar : ShrugSVG;

  const usernameToUse = username === '' || username === undefined ? userState!.username : username;

  const url = `${endpoints.GET_USER_AVATAR}/${usernameToUse}`;
  const response = await httpRequest(url, 'GET');

  return response.statusCode === 404 ? { username: usernameToUse, avatar: ShrugSVG } : response;
};

export default getUserAvatar;
