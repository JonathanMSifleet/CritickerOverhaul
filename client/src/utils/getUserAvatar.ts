import ShrugSVG from '../assets/svg/Shrug.svg';
import { GET_USER_AVATAR } from '../constants/endpoints';
import saveMoney from '../constants/saveMoney';
import httpRequest from './httpRequest';

const getUserAvatar = async (username: string): Promise<string> => {
  if (saveMoney) return ShrugSVG;

  const url = `${GET_USER_AVATAR}/${username}`;
  const response = await httpRequest(url, 'GET');

  return response.statusCode === 404 ? ShrugSVG : response;
};

export default getUserAvatar;
