import IAccessToken from '../../../shared/interfaces/IAccessToken';
import ITCI from '../../../shared/interfaces/ITCI';

export default interface IUserState {
  accessToken: IAccessToken;
  avatar?: string;
  loggedIn: boolean;
  TCIs?: ITCI[];
  username: string;
}
