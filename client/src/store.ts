import IAccessToken from '../../shared/interfaces/IAccessToken';
import IUserState from './interfaces/IUserState';
import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist({ key: 'userState' });

export const modalState = atom({
  key: 'SHOW_MODAL',
  default: false
});

export const userInfoState = atom({
  key: 'USER_INFO',
  default: {
    accessToken: null as null | IAccessToken,
    avatar: '',
    loggedIn: false,
    username: ''
  } as IUserState,
  effects_UNSTABLE: [persistAtom]
});
