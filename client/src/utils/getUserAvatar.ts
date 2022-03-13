import ShrugSVG from '../assets/svg/Shrug.svg';
import * as endpoints from '../constants/endpoints';
import httpRequest from './httpRequest';

const getUserAvatar = async (username: string): Promise<string> => {
  if (process.env.SAVE_MONEY) return ShrugSVG;

  const url = `${endpoints.GET_USER_AVATAR}/${username}`;
  const response = await httpRequest(url, 'GET');

  return response.statusCode === 404 ? ShrugSVG : response;
};

export default getUserAvatar;
