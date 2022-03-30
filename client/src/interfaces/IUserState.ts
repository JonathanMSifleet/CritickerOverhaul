import IAccessToken from '../../../shared/interfaces/IAccessToken';

export default interface IUserState {
  accessToken: IAccessToken;
  avatar?: string;
  loggedIn: boolean;
  username: string;
}
