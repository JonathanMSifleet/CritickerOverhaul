import ShrugSVG from '../assets/svg/Shrug.svg';
import * as endpoints from '../constants/endpoints';
import saveMoney from '../constants/saveMoney';
import httpRequest from './httpRequest';

const getUserAvatar = async (username: string): Promise<string> => {
  if (saveMoney) return ShrugSVG;

  const url = `${endpoints.GET_USER_AVATAR}/${username}`;
  const response = await httpRequest(url, 'GET');
  console.log('🚀 ~ file: getUserAvatar.ts ~ line 11 ~ getUserAvatar ~ response', response);

  return response.statusCode === 404 ? ShrugSVG : response;
};

export default getUserAvatar;
